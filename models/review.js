const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema= new Schema({
    content:String,
    rating:{
        type: Number,
        min:1,
        max:5,
    },
    createdAt:{
        type: Date,
        default:Date.now(),
    }
    });

const Review = mongoose.model("Review", reviewSchema);
module.exports=Review;
//this review will attack to listing menas 1 listing have multiple review. This show one to many relation model listing->reviews.