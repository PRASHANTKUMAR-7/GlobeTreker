const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        require: true,
    },
    description: String,
    image:{
        type: String,
        set:(v)=>v==="" ? "https://media.istockphoto.com/id/825319778/photo/sunset-on-beach.jpg?s=1024x1024&w=is&k=20&c=afSwJc6Q1aJFG26lPxSsDIx2aQU2ofsFGu9cGO6klkM=": v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
modules.export=Listing;