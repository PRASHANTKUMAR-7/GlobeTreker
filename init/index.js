const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initData= require("./data.js");


main().then(()=>{
    console.log("conected to DB")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

//first we delete all intial data in database 
const initDB = async()=>{
    await Listing.deleteMany({});
    // initData.data=initData.data.map((obj)=>({...obj,owner:""}))
    await Listing.insertMany(initData.data);//since initData is self obj so we extract data from it.
    console.log("data was Initialized");
};
initDB();