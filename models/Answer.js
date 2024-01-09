const { Schema, model } = require("mongoose");


const AnswerSchema=new Schema({
    
    answer:{
        type:String,
        required:true
    },
    doctorId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true});


const Answer=model("Answer",AnswerSchema);

module.exports=Answer;