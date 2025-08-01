const express= require("express");
const router= express.Router();
const user=require("../models/user.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",async(req,res)=>{ //we async with (req,res) because it make changes in database that can take time so to handle this we use async
    let {username,email,password}=req.body;
    const newUser= new User({email,username});
    const registerUser= await User.register(newUser,password);
    console.log(registerUser);
    req.flash("success","Welcome to GlobeTreker");
    res.redirect("/listing");
});


module.exports=router;