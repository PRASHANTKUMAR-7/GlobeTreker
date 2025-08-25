const Reviews = require("../models/review.js");// review mongodb Schema
const Listing=require("../models/listing.js");

//route for creating new review
module.exports.newReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview=new Reviews(req.body.reviews);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");//creating a flash msg after creating new review of place
     res.redirect("/listings");
};