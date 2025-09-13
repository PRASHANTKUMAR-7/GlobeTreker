const express= require("express");
const router= express.Router();

const wrapAsync=require("../utils/wrapAsync.js"); //client side custome error handling
const Listing = require("../models/listing.js"); // lisiting mongodb Schema
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const ListingController=require("../controller/listings.js")
const multer = require('multer');//multer is user to parse form data
const upload = multer({dest: 'uploads/'});//after parsing form data save to uploads folder

router
//print all data on root route or It is Index Route
    .route("/")
    .get(wrapAsync(ListingController.index) //index is a the variable used here as refrence of function which is in listings file of controller folder
    )
    .post(upload.single("listing[image]"),(req,res)=>{
    res.send(req.file);
    }
);

//Route to Create new Listing
router.get("/new", isLoggedIn, wrapAsync(ListingController.renderNewForm));

//Route to save new data created by above route 
//there are two method to get data inserted in form either by targeting each data like this := let{title, description,image,price,country, location}=req.body but it is long method we can do it simmple way just make all data in new.ejs obj of listing watch in new.ejs 
// router.post("/",isLoggedIn, 
//     validateListing, //first check the validateListing then all 
//     wrapAsync(ListingController.createListing)
// );  




//Show Route
router.get("/:id",  wrapAsync(ListingController.showRoute));

//Route for edit the listing
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(ListingController.editListing));

//Route which take input from edit.ejs and save it to database "Update Route"
router.put("/:id",isLoggedIn,isOwner,
    validateListing,
    wrapAsync(ListingController.updateListing));

//Route to delete the list
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(ListingController.deleteListing));

module.exports=router;