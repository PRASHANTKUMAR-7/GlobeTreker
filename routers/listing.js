const express= require("express");
const router= express.Router();
const wrapAsync=require("../utils/wrapAsync.js"); //client side custome error handling
const {listingSchema,reviewSchema} = require("../schema.js"); //server side error handling to check schema of listing and review at server database using JOI
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js"); // lisiting mongodb Schema

//converting JOI to middleware using funtion  for listing valoidation 
const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        //since the error is obj so we map it  below and use only use full data from it 
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};


//print all data on root route or It is Index Route
router.get("/", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
});

//Route to Create new Listing
router.get("/new",  wrapAsync(async (req, res) => {
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to create listing");
    //     return res.redirect("/login");
    // } this is going to use ad middleware becuse it will use several placea like delete/edit listing
    res.render("listings/new.ejs");

})); // we puth this route before show route because app.js considering new as id hence ther is error for going on route listings/new

//Route to save new data created by above route 
//there are two method to get data inserted in form either by targeting each data like this := let{title, description,image,price,country, location}=req.body but it is long method we can do it simmple way just make all data in new.ejs obj of listing watch in new.ejs 
router.post("/", 
    validateListing, //first check the validateListing then all 

    wrapAsync(async (req, res,next) => {
    // From now  this below condition is held by JOI 
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }

    // //condition 1 to check each data is valid on schema via using if condition on each case
    // if(!newList.title){
    //     throw new ExpressError(400,"Title is missing");
    // }
    // if(!newList.description){
    //     throw new ExpressError(400,"Description is missing");
    // }
    // if(!newList.price){
    //     throw new ExpressError(400,"Price is missing");
    // }
    // if(!newList.country){
    //     throw new ExpressError(400,"Country is missing");
    // }

    //condition 2 checked by JOI external tool and comment it beacuse now it converted into a middleware at the top of all router we can see it 
    // let result=listingSchema.validate(req.body); //here we check that the data is going to insert in db is valid which came from req.body
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    const newList = new Listing(req.body.listing);
    await newList.save();
    req.flash("success","New Listing Created!");//creating a flash msg after creating new list of place
    res.redirect("/listings");    
})
);  

//Show Route
router.get("/:id",  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); //populate is use to get data by array of ids
    if(!listing){
         req.flash("error","List does not exit!");//creating a flash msg of error when list does not exit
         return res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
}));

//Route for edit the listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
         req.flash("error","List does not exit!");//creating a flash msg of error when list does not exit
         return res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
}));

//Route which take inout from edit.ejs and save it to database "Update Route"
router.put("/:id",
    validateListing,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //since Listing is a js obj which has all parameter of db
    req.flash("success","List Updated!");//creating a flash msg after updating list
    res.redirect(`/listings/${id}`); //this will redirect on Show.ejs
}));

//Route to delete the list
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); //when findByIdDelete call the the middleware we used in schema section in listing.js it will get executed and deleted all reviews.
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");//creating a flash msg after deleting new list of place
    res.redirect("/listings");
}));

module.exports=router;