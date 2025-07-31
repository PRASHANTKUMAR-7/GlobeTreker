const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type:String,
        required: true
        //we don't not required to write username and password 
        //schema in user Schema because passport mongoose 
        //already define it to the schema automatically when 
        //schema created for database
    }
});
//plugin is use becuse it automatically add/implement salting, hashing, username and userpassword. 
User.plugin(passportlocalmongoose);
module.exports=mongoose.model('User',userSchema);