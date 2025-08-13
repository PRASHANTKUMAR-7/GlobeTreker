const express= require("express");
const router= express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport= require("passport")
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{ //we async with (req,res) because it make changes in database that can take time so to handle this we use async
    try{
    let {username,email,password}=req.body;
    const newUser= new User({email,username});
    const registerUser= await User.register(newUser,password);
    req.login(registerUser,(err)=>{
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
    passport.authenticate("local",
        {failureRedirect: '/login',
            failureFlash: true}),
            async(req,res)=>{
                req.flash("success","Welcome To GlobeTreker");
                res.redirect("/listings");
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