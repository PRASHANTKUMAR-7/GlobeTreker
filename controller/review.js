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

//route for deleting review
module.exports.deleteReview=async(req,res)=>{
        let {id, reviewId}=req.params;
        await Listing.findByIdAndUpdate(id, { $pull: {reviews:reviewId}});
        await Reviews.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted!");//creating a flash msg after creating new review of place
        res.redirect(`/listings`);
    };