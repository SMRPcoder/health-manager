const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PrescriptionSchema=new Schema({
    prescriptionNumber:{
        type:Number,
        unique:true
    },
    patientId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    AppoinmentId:{
        type:Schema.Types.ObjectId,
        ref:"Appoinment",
        required:true
    },
    problem:{
        type:String,
        default:"Regular"
    },
    medicines:[{
        type:Schema.Types.ObjectId,
        ref:"Medicine"
    }],
    doctorId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true}).plugin(AutoIncrement,  { inc_field: 'prescriptionNumber' });

const Prescription=model("Prescription",PrescriptionSchema);

module.exports=Prescription;