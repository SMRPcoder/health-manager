const { Schema, model } = require("mongoose");
const bcrypt=require("mongoose-bcrypt");

const UserSchema=new Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        bcrypt:true,
        required:true
    },
    roleId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Role"
    },
    name:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        type:String
    },
    age:{
        type:Number
    },
    dob:{
        type:String
    },
    gender:{
        type:String
    },
    profile:{
        type:String
    }
},{timestamps:true}).plugin(bcrypt,{
    fields:["password"]
})

const User=model("users",UserSchema);
module.exports=User;