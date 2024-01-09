const { Schema ,model } = require("mongoose");


const AppoinmentSchema=new Schema({
    doctorId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    patientId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"waiting"
    },
    virtual:{
        type:Boolean,
        default:false
    },
    link:{
        type:String
    }

},{timestamps:true});


const Appoinment=model("Appoinment",AppoinmentSchema);

module.exports=Appoinment;
