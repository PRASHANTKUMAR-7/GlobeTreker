

//create new user route
module.exports.signUp=async(req,res)=>{ //we async with (req,res) because it make changes in database that can take time so to handle this we use async
    try{
    let {username,email,password}=req.body;
    const newUser= new User({email,username});
    const registerUser= await User.register(newUser,password);
    req.login(registerUser,(err)=>{ //if a user got signed up then it automatically logged in 
        if(err){
            return next(err);
        }
        req.flash("success","You are logged In!");
        res.redirect("/listings")
        });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");

    }
};