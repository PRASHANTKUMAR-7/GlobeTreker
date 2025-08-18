const express= require("express");
const router= express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{ //we async with (req,res) because it make changes in database that can take time so to handle this we use async
    try{
    let {username,email,password}=req.body;
    const newUser= new User({email,username});
    const registerUser= await User.register(newUser,password);
    req.login(registerUser,(err)=>{ //if a user got signed up then it automatically logged in 
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings")
        });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");

    }
}));

//login route
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",
    saveRedirectUrl,//to redirect the user from that route/page from where it came for login using locals variables and middleware
    passport.authenticate("local",
        {failureRedirect: '/login',
            failureFlash: true}),
            async(req,res)=>{
                req.flash("success","Welcome To GlobeTreker");
                 // ✅ Fallback to a safe route if no redirectUrl was saved
                const redirectUrl = res.locals.redirectUrl || "/listings";//since if we direct login from listing then saveRedirectUrl never execute and we dont get locals and if no locals then we get no prev route so to avoid this we use OR operator to avoid this ans use it b/w res.locals.redirectUrl and "/listings".
                delete req.session.redirectUrl; // clear session value
                res.redirect(redirectUrl);
});
//log out route
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings")
    });
});

module.exports=router;