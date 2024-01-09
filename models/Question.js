const { Schema,model } = require("mongoose");


const QuestionSchema=new Schema({
    question:{
        type:String,
        required:true
    },
    patientId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    answers:[{
        type:Schema.Types.ObjectId,
        ref:"Answer",
        required:true
    }]
},{timestamps:true});

const Question=model("Question",QuestionSchema);

module.exports=Question;