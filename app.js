const express=require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");


main().then(()=>{
    console.log("conected to DB")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}


app.get("/", (req,res)=>{
    res.send("Hi, I am Root");
});

//creating a sample Listing 
app.get("/testListing" ,async (req,res)=>{
    let sampleListing = new Listing({
        title: "New Villa",
        description: "Om Namah Shivay",
        price: 12000,
        location: "Assi Ghat, Varanasi",
        country: "India",
    });
    await sampleListing.save();
    console.log("Sample was Saved");
    res.send("Successful");
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});