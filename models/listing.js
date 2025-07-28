const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./review.js");

const listingSchema= new Schema({
    title: {
        type: String,
        required: true,
      },
      description: String,
      image: {
        filename: { type: String, default: "defaultimage" },
        url: {
          type: String,
          default:
            "https://cdn.pixabay.com/photo/2023/03/03/10/41/hut-7827369_1280.jpg",
        },
      },
      price: Number,
      location: String,
      country: String,
    //adding review array which etablish one to many relation.
      reviews:[
        {
          type: Schema.Types.ObjectId,
          ref:"Reviews"
        },
      ],
    });

    //mongoose middleware used to delete all reviews when the particular list is deleted
    listingSchema.post("findOneAndDelete", async(listing)=>{
      if(listing){
      await Review.deleteMany({_id: {$in: listing.reviews}});
      }
    });

const Listing = mongoose.model("Listing", listingSchema);
module.exports=Listing;