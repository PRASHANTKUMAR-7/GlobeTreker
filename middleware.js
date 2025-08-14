module.exports.isLoggedIn=(req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originaUrl; //redired the user from when it canme to login
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}