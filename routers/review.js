const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js"); //client side custome error handling
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js"); //server side error handling to check schema of listing and review at server database using JOI
const Reviews = require("../models/review.js");// review mongodb Schema
const Listing=require("../models/listing.js");


//converting JOI to middleware using funtion  for review valoidation 
const validatereview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        //since the error is obj so we map it  below and use only usefull data from it 
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

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
        await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
        await Reviews.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted!");//creating a flash msg after creating new review of place
        res.redirect(`/listings/${id}`);
    })
);

module.exports=router;