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