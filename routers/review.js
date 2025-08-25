const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js"); //client side custome error handling
const ExpressError=require("../utils/ExpressError.js");
const Reviews = require("../models/review.js");// review mongodb Schema
const Listing=require("../models/listing.js");
const {validatereview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controller/review.js");

//Create new review
router.post("/",validatereview,isLoggedIn, wrapAsync(reviewController.newReview));

//Deleting Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync()
);

module.exports=router;