const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema= new Schema({
    comment:String,
    rating:{
        type: Number,
        min:1,
        max:5,
    },
    createdAt:{
        type: Date,
        default:Date.now(),
    },
    author:{
        type:schema.Type.ObjectId,
        ref:"User"
    }
    });

const Reviews = mongoose.model("Reviews", reviewSchema);
module.exports=Reviews;
//this review will attack to listing menas 1 listing have multiple review. This show one to many relation model listing->reviews.