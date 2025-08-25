const express= require("express");
const router= express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController= require("../controller/user.js");

router.get("/signup",userController.renderSignupForm);
router.post("/signup",wrapAsync(userController.signUp));

//login route
router.get("/login",userController.renderloginForm);
router.post("/login",
    saveRedirectUrl,//to redirect the user from that route/page from where it came for login using locals variables and middleware
    passport.authenticate("local",
        {failureRedirect: '/login',
            failureFlash: true}),
            userController.login);
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