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
    initData.data=initData.data.map((obj)=>({...obj,owner:"68a30e3de86bbe91342b4c43"}));//ading owner to each list & .map return a new array so we save it into old array
    await Listing.insertMany(initData.data);//since initData is self obj so we extract data from it.
    console.log("data was Initialized");
};
initDB();