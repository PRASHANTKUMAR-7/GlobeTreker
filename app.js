// aquiring/requiring  and loading function  

const express = require("express"); //adding express
const app = express();
const mongoose = require('mongoose'); //adding mongoose

const Listing = require("./models/listing.js"); // lisiting mongodb Schema

const path = require("path");
const methodOverride = require("method-override"); //use for changing form get/post to delete/patch
const ejsMate = require("ejs-mate");

const wrapAsync=require("./utils/wrapAsync.js"); //client side custome error handling

const ExpressError=require("./utils/ExpressError.js");

const {listingSchema,reviewSchema} = require("./schema.js"); //server side error handling to check schema of listing and review at server database using JOI
const Reviews = require("./models/review.js");// review mongodb Schema

const listingsRouter=require("./routers/listing.js");
const reviewsRouter=require("./routers/review.js");
const usersRouter=require("./routers/user.js");
const session= require("express-session");//require session 
const flash=require("connect-flash");

//from here we use passport for authentication
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User= require("./models/user.js");

// establishing mongodb with try and catch
main().then(() => {
    console.log("conected to DB")
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

app.set("view engine", "ejs"); //use to get accsess to ejs file
app.set("views", path.join(__dirname, "views")); // use to define folder name to js to search ejs file
app.use(express.urlencoded({ extended: true })); //it it use to get data or extract data from url 
app.use(methodOverride("_method")); //use to get accses to method who is responsible for chaning form GET/POST req to DELETE/PUT 
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));//use to accsess to static file like css and more

// Middleware to parse incoming requests with JSON payloads
// This allows you to access data sent in the body of a POST or PUT request via req.body
// Required when sending requests with 'Content-Type: application/json'
// e.g., in tools like Hoppscotch or Postman, or from React/JS frontend using fetch or axios
app.use(express.json());

const sessionOptions={
    secret:"encryptedText",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expirre: Date.now() + 7 * 24 * 60 * 60 * 1000, //cookies willget expire after 7 days and time is given in mm sec.
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true, //use for security peerpose like defend from crossscripting attack
    }
};


// this is the root route
app.get("/", (req, res) => {
    res.send("Hi, I am Root");
});

app.use(session(sessionOptions));
app.use(flash()); //make sure always use session and flash before creating route

//we use passport after session because we dont want user to login again and again on esch page
app.use(passport.initialize());//we have to initialize passport before use
app.use(passport.session());//passport session use for provide ability to identify user as they browse from any page
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success"); //any msg with success(flash key) came goes to res.locals with its msg
    res.locals.error=req.flash("error");//any msg with error(flash key) came goes to res.locals with its msg
    next(); //make sure to call next() to move on oherwise we stuck here
});

// //adding a fake user
// app.get("/demouser", async(req,res)=>{
//  let fakeUser= new User({
//     email:"abc@gmail.com",
//     username:"motupatalu",
//  });
//  let registeredUser= await User.register(fakeUser,"userpassword");
//  res.send(registeredUser);
// });






//--------------------Route of same type are used using express route-----------------
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter); 
app.use("/",usersRouter);








//*******************************************************************************************************************//
// ALL THESE ROUTE ARE MANAGED BY EXPRESS ROUTE 
//******************************************************************************************************************//
// //print all data on root route or It is Index Route
// app.get("/listings", async (req, res) => {
//     const allListing = await Listing.find({});
//     res.render("./listings/index.ejs", { allListing });
// });

// //Route to Create new Listing
// app.get("/listings/new",  wrapAsync(async (req, res) => {
//     res.render("listings/new.ejs");

// })); // we puth this route before show route because app.js considering new as id hence ther is error for going on route listings/new

// //Route to save new data created by above route 
// //there are two method to get data inserted in form either by targeting each data like this := let{title, description,image,price,country, location}=req.body but it is long method we can do it simmple way just make all data in new.ejs obj of listing watch in new.ejs 
// app.post("/listings", 
//     validateListing, //first check the validateListing then all 

//     wrapAsync(async (req, res,next) => {
//     // From now  this below condition is held by JOI 
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"Send valid data for listing");
//     // }

//     // //condition 1 to check each data is valid on schema via using if condition on each case
//     // if(!newList.title){
//     //     throw new ExpressError(400,"Title is missing");
//     // }
//     // if(!newList.description){
//     //     throw new ExpressError(400,"Description is missing");
//     // }
//     // if(!newList.price){
//     //     throw new ExpressError(400,"Price is missing");
//     // }
//     // if(!newList.country){
//     //     throw new ExpressError(400,"Country is missing");
//     // }

//     //condition 2 checked by JOI external tool and comment it beacuse now it converted into a middleware at the top of all router we can see it 
//     // let result=listingSchema.validate(req.body); //here we check that the data is going to insert in db is valid which came from req.body
//     // console.log(result);
//     // if(result.error){
//     //     throw new ExpressError(400, result.error);
//     // }
//     const newList = new Listing(req.body.listing);
//     await newList.save();
//     res.redirect("/listings");    
// })
// );  

// //Show Route
// app.get("/listings/:id",  wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews"); //populate is use to get data by array of ids
//     res.render("listings/show.ejs", { listing });
// }));

// //Route for edit the listing
// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// }));

// //Route which take inout from edit.ejs and save it to database "Update Route"
// app.put("/listings/:id",
//     validateListing,
//     wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //since Listing is a js obj which has all parameter of db
//     res.redirect(`/listings/${id}`); //this will redirect on Show.ejs
// }));

// //Route to delete the list
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id); //when findByIdDelete call the the middleware we used in schema section in listing.js it will get executed and deleted all reviews.
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));
//*******************************************************************************************************************//
// ALL THESE ROUTE above ARE MANAGED BY EXPRESS ROUTE 
//******************************************************************************************************************//
 

//We don't created a get route to access review b/c it get access by listing route
// Route to save review
//Route is commented and used in express route

// app.post("/listings/:id/reviews",validatereview, wrapAsync(async(req,res)=>{
//     let listing= await Listing.findById(req.params.id);
//     let newReview=new Reviews(req.body.reviews);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//      res.redirect("/listings");
// }));

// //Deleting Review Route
// app.delete("/listings/:id/reviews/:reviewId", 
//     wrapAsync(async(req,res)=>{
//         let {id, reviewId}=req.params;
//         await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
//         await Reviews.findByIdAndDelete(reviewId);

//         res.redirect(`/listings/${id}`);
//     })
// );



//creating a sample Listing 
// app.get("/testListing" ,async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "New Villa",
//         description: "Om Namah Shivay",
//         price: 12000,
//         location: "Assi Ghat, Varanasi",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was Saved");
//     res.send("Successful");
// });



//middleware to check for error and custom error also database error 
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { err });
});


// if there is error in above router and then our middleware error handler will work 
// but is router doesn't match or doesn't exit then then we go for a universal error handling .
// app.all(/.*/, (req, res, next) => {
//   next(new ExpressError(404,"Page Not Found"));
// });
app.get('/favicon.ico', (req, res) => res.status(204)); //to handle favicon.ico file error
app.all(/.*/, (req, res, next) => {
  console.log(`404 on ${req.method} ${req.originalUrl}`);
  next(new ExpressError(404, "Page Not Found"));
});


app.listen(8080, () => { 
    console.log("server is listening to port 8080");
});