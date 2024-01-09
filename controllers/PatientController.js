const { AppoinmentValidation } = require("../functions/validation");
const { request, response } = require("express");
const Appoinment = require("../models/Appoinment");
const Question = require("../models/Question");

exports.BookAppoinment = (req = request, res = response) => {
    try {
        const { value, error } = AppoinmentValidation.validate(req.body);
        if (!error) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            var tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1)
            Appoinment.where({ userId: req.user_id, createdAt: { $gte: today, $lt: tomorrow } }).findOne().then(data => {
                if (data) {
                    res.status(302).json({ message: "Already Found,you have Today Appoinment Already", status: false });
                } else {
                    value.patientId=req.user_id;
                    const newAppoinment = new Appoinment(value);
                    newAppoinment.save().then(savedData => {
                        res.status(200).json({ message: "Appoinment Booked successfully", data: savedData, status: true });
                    }).catch(err => {
                        console.log(err);
                        res.status(417).json({ message: "Unexpected Error Happend", status: false });
                    })
                }
            }).catch(err => {
                console.log(err);
                res.status(417).json({ message: "Unexpected Error Happend", status: false });
            })
        } else {

            console.log(error);
            res.status(206).json({ message: error.message, status: false });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
}

exports.CheckStatus=(req = request, res = response) => {
    try {
        const {id}=req.body;
        Appoinment.findById(id).then(data=>{
            if(data){
                res.status(200).json({data,status:true});
            }else{
                res.status(404).json({message:"data Not Found",status:false});
            }
        }).catch(err=>{
            console.log(err);
            res.status(417).json({message:"Unexpected error Happend",status:false});
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
}

exports.AskDoubts=(req = request, res = response) => {
    try {
        const {question}=req.body
        var doubt={
            question,
            patientId:req.user_id
        };
        const newQuestion=new Question(doubt);
        newQuestion.save().then(data=>{
            res.status(200).json({message:"Question Posted,Doctors will Reply Soon",data,status:true});
        }).catch(err=>{
            console.log(err);
            res.status(417).json({message:"Unexpected error Happend",status:false});
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
}