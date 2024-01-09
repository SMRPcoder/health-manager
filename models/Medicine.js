const { Schema,model } = require("mongoose");


const MedicineSchema=new Schema({
    medicineName:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
},{timestamps:true});

const Medicine=model("Medicine",MedicineSchema);

module.exports=Medicine;