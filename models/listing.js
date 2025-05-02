const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
            "https://media.istockphoto.com/id/825319778/photo/sunset-on-beach.jpg?s=1024x1024&w=is&k=20&c=afSwJc6Q1aJFG26lPxSsDIx2aQU2ofsFGu9cGO6klkM=",
        },
      },
      price: Number,
      location: String,
      country: String,
    });

const Listing = mongoose.model("Listing", listingSchema);
module.exports=Listing;