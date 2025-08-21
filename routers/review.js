const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js"); //client side custome error handling
const ExpressError=require("../utils/ExpressError.js");
const Reviews = require("../models/review.js");// review mongodb Schema
const Listing=require("../models/listing.js");
const {validatereview}=require("../middleware.js");


router.post("/",validatereview, wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview=new Reviews(req.body.reviews);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");//creating a flash msg after creating new review of place
     res.redirect("/listings");
}));

//Deleting Review Route
router.delete("/:reviewId", 
    wrapAsync(async(req,res)=>{
        let {id, reviewId}=req.params;
        await Listing.findByIdAndUpdate(id, { $pull: {reviews:reviewId}});
        await Reviews.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted!");//creating a flash msg after creating new review of place
        res.redirect(`/listings`);
    })
);

module.exports=router;