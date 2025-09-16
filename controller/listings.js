const Listing = require("../models/listing")

module.exports.index=async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
};

module.exports.renderNewForm=async (req, res) => {
    // if(!req.isAuthenticated()){ *now shif to middleware*
        //     req.flash("error","You must be logged in to create listing");
        //     return res.redirect("/login");
        // } this is going to use ad middleware becuse it will use several placea like delete/edit listing
        // we puth this route before show route because app.js considering new as id hence ther is error for going on route listings/new
    
    res.render("listings/new.ejs");

};
module.exports.showRoute=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
        path:"author",
    }})
    .populate("owner"); //populate is use to get data by array of ids
    if(!listing){
         req.flash("error","List does not exit!");//creating a flash msg of error when list does not exit
         return res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing=async (req, res,next) => {
    // From now  this below condition is held by JOI 
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }

    // //condition 1 to check each data is valid on schema via using if condition on each case
    // if(!newList.title){
    //     throw new ExpressError(400,"Title is missing");
    // }
    // if(!newList.description){
    //     throw new ExpressError(400,"Description is missing");
    // }
    // if(!newList.price){
    //     throw new ExpressError(400,"Price is missing");
    // }
    // if(!newList.country){
    //     throw new ExpressError(400,"Country is missing");
    // }

    //condition 2 checked by JOI external tool and comment it beacuse now it converted into a middleware at the top of all router we can see it 
    // let result=listingSchema.validate(req.body); //here we check that the data is going to insert in db is valid which came from req.body
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    const newListing = new Listing(req.body.listing);
newListing.owner = req.user._id;

if (req.file) {
  let url = req.file.path;
  let filename = req.file.filename;
  newListing.image = { url, filename };
} //to save image as it is not by its link

// if no file, schema defaults will apply
await newListing.save();

    req.flash("success","New Listing Created!");//creating a flash msg after creating new list of place
    res.redirect("/listings");    
};

module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
         req.flash("error","List does not exit!");//creating a flash msg of error when list does not exit
         return res.redirect("/listings")
    }
    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/h_250,w_250");//changing image quality using cloundinary inbuilt function
    res.render("listings/edit.ejs", { listing,originalUrl });
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //since Listing is a js obj which has all parameter of db
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success","List Updated!");//creating a flash msg after updating list
    res.redirect(`/listings/${id}`); //this will redirect on Show.ejs
};

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); //when findByIdDelete call the the middleware we used in schema section in listing.js it will get executed and deleted all reviews.
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");//creating a flash msg after deleting new list of place
    res.redirect("/listings");
};