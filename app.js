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
app.use(express.urlencoded({ extended: true }));


app.get("/", (req,res)=>{
    res.send("Hi, I am Root");
});

//print all data on root route or It is Index Route
app.get("/listings", async(req,res)=> {
   const allListing= await Listing.find({});
   res.render("./listings/index.ejs",{allListing});
});
//Route to Create new Listing
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
}); // we puth this route before show route because app.js considering new as id hence ther is error for going on route listings/new

//Show Route
app.get("/listings/:id", async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
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