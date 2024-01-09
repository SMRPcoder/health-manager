const { Schema, model } = require("mongoose");


const RolesSchema=new Schema({
    roleName:{
        type:String,
        required:true,
        unique: true
    }

},{timestamps:true});


const Role=model("Role",RolesSchema);
module.exports=Role;