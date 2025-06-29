// aquiring/requiring  and loading function  

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");


// establishing mongodb wiht try and catch
main().then(() => {
    console.log("conected to DB")
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

app.set("view engine", "ejs"); //use to get accsess to ejs file
app.set("views", path.join(__dirname, "views")); // use to define folder name to js to search ejs file
app.use(express.urlencoded({ extended: true })); //it it use to get data or extract data from url 
app.use(methodOverride("_method")); //use to get accses to method who is responsible for chaning form GET/POST req to DELETE/PUT 
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));//use to accsess to static file like css and more


// this is the root route
app.get("/", (req, res) => {
    res.send("Hi, I am Root");
});

//print all data on root route or It is Index Route
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
});

//Route to Create new Listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
}); // we puth this route before show route because app.js considering new as id hence ther is error for going on route listings/new

//Route to save new data created by above route 
//there are two method to get data inserted in form either by targeting each data like this := let{title, description,image,price,country, location}=req.body but it is long method we can do it simmple way just make all data in new.ejs obj of listing watch in new.ejs 
app.post("/listings", wrapAsync(async (req, res,next) => {
    const newList = new Listing(req.body.listing);
    await newList.save();
    res.redirect("/listings");    
})
);  

//Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//Route for edit the listing
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Route which take inout from edit.ejs and save it to database
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //since Listing is a js obj which has all parameter of db
    res.redirect(`/listings/${id}`); //this will redirect on Show.ejs
});

//Route to delete the list
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
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



//middleware to check for error and custom error also database error 
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).send(message);
});


// if there is error in above router and then our middleware error handler will work 
// but is router doesn't match or doesn't exit then then we go for a universal error handling .
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});