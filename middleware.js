module.exports.isLoggedIn=(req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originaUrl; //redirect the user from when it canme to login but passport always reset session when user login to first we save the prev route in variable then use it in locals variable where passport can't get access to the locals and then use the locals in below middleware 
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