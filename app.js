const express=require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");


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
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate); 



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

//Route to save new data created by abouve route 
//there are two method to get data inserted in form either by targeting each data like this := let{title, description,image,price,country, location}=req.body but it is long method we can do it simmple way just make all data in new.ejs obj of listing watch in new.ejs 
app.post("/listings",async(req,res)=>{
    const newList=new Listing(req.body.listing);
    await newList.save();
    res.redirect("/listings");
})

//Show Route
app.get("/listings/:id", async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//Route for edit the listing
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
//Route which take inout from edit.ejs and save it to database
app.put("/listings/:id",async(req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //since Listing is a js obj which has all parameter of db
    res.redirect(`/listings/${id}`); //this will redirect on Show.ejs
});

//Route to delete the list
app.delete("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    let deletedListing=await Listing.findByIdAndDelete(id); 
    console.log(deletedListing);
    res.redirect("/listings");   
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