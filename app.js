const express=require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path= require("path");


main().then(()=>{
    console.log("conected to DB")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));


app.get("/", (req,res)=>{
    res.send("Hi, I am Root");
});

//print alll data on root route
app.get("/listing", async(req,res)=> {
   const allListing= await Listing.find({});
   res.render("./listings/index.ejs",{allListing});
});

//creating a sample Listing 
// app.get("/testListing" ,async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "New Villa",
//         description: "Om Namah Shivay",
//         price: 12000,
//         location: "Assi Ghat, Varanasi",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was Saved");
//     res.send("Successful");
// });

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});