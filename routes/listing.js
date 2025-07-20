const express= require("express");
const router= express.Router();

//print all data on root route or It is Index Route
router.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
});

//Route to Create new Listing
router.get("/listings/new",  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");

})); // we puth this route before show route because app.js considering new as id hence ther is error for going on route listings/new

//Route to save new data created by above route 
//there are two method to get data inserted in form either by targeting each data like this := let{title, description,image,price,country, location}=req.body but it is long method we can do it simmple way just make all data in new.ejs obj of listing watch in new.ejs 
router.post("/listings", 
    validateListing, //first check the validateListing then all 

    wrapAsync(async (req, res,next) => {
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
    const newList = new Listing(req.body.listing);
    await newList.save();
    res.redirect("/listings");    
})
);  

//Show Route
router.get("/listings/:id",  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); //populate is use to get data by array of ids
    res.render("listings/show.ejs", { listing });
}));

//Route for edit the listing
router.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Route which take inout from edit.ejs and save it to database "Update Route"
router.put("/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //since Listing is a js obj which has all parameter of db
    res.redirect(`/listings/${id}`); //this will redirect on Show.ejs
}));

//Route to delete the list
router.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); //when findByIdDelete call the the middleware we used in schema section in listing.js it will get executed and deleted all reviews.
    console.log(deletedListing);
    res.redirect("/listings");
}));