const Listing = require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js"); //server side error handling to check schema of listing and review at server database using JOI

//converting JOI to middleware using funtion  for listing valoidation 
module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        //since the error is obj so we map it  below and use only use full data from it 
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

//converting JOI to middleware using funtion  for review valoidation 
module.exports.validatereview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        //since the error is obj so we map it  below and use only usefull data from it 
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

module.exports.isLoggedIn=(req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl; // ✅ correct spelling
 //redirect the user from when it canme to login but passport always reset session when user login to first we save the prev route in variable then use it in locals variable where passport can't get access to the locals and then use the locals in below middleware 
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}    

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
     //redired the user from when it canme to login
        }
    next();
};

//middleware to protect listing from editing and deleting from unknown user(only owner can do means the creater)
module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){ //logic to check weather the user is same who wants to edit=owner 
        req.flash("error","You arren't the owner of this listing");
         return res.redirect(`/listings/${id}`);
    }
    next();
};


//middleware to protect review from editing and deleting from unknown user(only owner can do means the creater)
module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review= await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){ //logic to check weather the user is same who wants to edit=owner 
        req.flash("error","You arren't the author of this review");
         return res.redirect(`/listings/${id}`);
    }
    next();
};