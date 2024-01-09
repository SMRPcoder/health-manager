const { request, response } = require("express");
const Appoinment = require("../models/Appoinment");
const { CreateJwt, VerifyToken } = require("../functions/functions");
const { PrescriptionValidation, EditValidation } = require("../functions/validation");
const Prescription = require("../models/Prescription");
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");


exports.EditProfile = (req = request, res = response) => {
    try {
        const { value, error } = EditValidation.validate(req.body);
        if (!error) {
            console.log(value);
            User.findByIdAndUpdate(req.user_id, value, { new: true }).then(data => {
                if (data) {
                    res.status(200).json({ message: "Successfully Changed", status: true });
                } else {
                    res.status(400).json({ message: "Bad Request", status: false });
                }
            }).catch(err => {
                console.log(err);
                res.status(417).json({ message: "Unexpected Error", status: false });
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

exports.EditProfilePic=(req = request, res = response) => {
    try {
        User.findByIdAndUpdate(req.user_id,{profile:req.file.path}).then(async data=>{
            if(data){
                res.status(200).json({message:"Profile Picture Updated successfully",status:true});
            }else{
                res.status(400).json({message:"Data Not Found or Error Happend",status:false});
            }
        }).catch(err => {
            console.log(err);
            res.status(417).json({ message: "Unexpected Error", status: false });
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
}


exports.ViewAllAppoinment = (req = request, res = response) => {
    try {
        var page = Number(req.params.page) || 1;
        var limit = Number(req.params.limit) || 10;
        var offset = (page * limit) - limit;

        Appoinment.where({ doctorId: req.user_id }).limit(limit).skip(offset).find().then(data => {
            res.status(200).json({ data, status: true });
        }).catch(err => {
            console.log(err);
            res.status(417).json({ message: "Unexpected Error", status: false });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
}

exports.ChangeAppoinmentStatus = (req = request, res = response) => {
    try {

        const { id, status } = req.body;

        Appoinment.findOneAndUpdate({ _id: id, status: "waiting" }, { status }, { new: true }).then(data => {
            if (data) {
                res.status(200).json({ message: "Status Changed Successfully", status: true });
            } else {
                res.status(206).json({ message: "Maybe A Already Approved/DisApproved Appoinment or Wrong Id", status: false });
            }
        }).catch(err => {
            console.log(err);
            res.status(417).json({ message: "Unexpected Error Occured", status: false });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
}

exports.AttendPatient = (req = request, res = response) => {
    try {

        const { id } = req.body;
        Appoinment.findOneAndUpdate({ _id: id, status: "approved" }, { status: "attending" }, { new: true }).then(async data => {
            if (data) {

                const token = CreateJwt({ patientId: id, AppoinmentId: data._id });

                if (data.virtual) {
                    var link = "http://linktovirtualcall.com/dsvsfbs"; //here we want to generate a link for googlemeet or zoom video meet link
                    await data.update({ link })
                    res.status(200).json({ message: "Created Successfully", link, token, status: true });
                } else {
                    res.status(200).json({ message: "Patient Marked", token, status: true });
                }
            } else {
                res.status(206).json({ message: "May This Appoinment is Already Attend or Disapproved", status: false });
            }
        }).catch(err => {
            console.log(err);
            res.status(417).json({ message: "Unexpected Error Occured", status: false });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
}

exports.CreatePrescription = (req = request, res = response) => {
    try {
        const { value, error } = PrescriptionValidation.validate(req.body);
        if (!error) {
            value.token = (value.token).split(" ")[1];
            VerifyToken(value.token).then(data => {
                var AppoinmentId = data.AppoinmentId;
                var patientId = data.patientId;
                var UpdateOperations = Object.entries(value.medicines).map(([_id, quantity]) => ({
                    updateOne: {
                        filter: { _id },
                        update: { $inc: { quantity: -quantity } }
                    }
                }))
                const newPrescription = new Prescription({
                    patientId,
                    AppoinmentId,
                    problem: value.problem,
                    medicines: Object.keys(value.medicines),
                    doctorId: req.user_id
                });
                newPrescription.save().then(async (savedPrescription) => {
                    await Medicine.bulkWrite(UpdateOperations);
                    res.status(201).json({ message: "Prescription Created Successfully", status: true, prescriptionId: savedPrescription._id });
                }).catch(err => {
                    console.log(err);
                    res.status(417).json({ message: "Unexpected Error Occured", status: false });
                })
            }).catch(err => {
                console.log(err);
                res.status(412).json({ message: "JWT Error", status: false });
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

exports.ViewPrescription = (req = request, res = response) => {
    try {
        const { id } = req.body;
        Prescription.findById(id).then(data => {
            if (data) {
                res.status(200).json({ data, status: true });
            } else {
                res.status(404).json({ message: "Id Not Found", status: false });
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
}

exports.ViewAllMedicines = (req = request, res = response) => {

    try {
        var page = Number(req.params.page) || 1;
        var limit = Number(req.params.limit) || 10;
        var offset = (page * limit) - limit;

        Medicine.find().skip(offset).limit(limit).then(data => {
            res.status(200).json({ data, status: true });
        }).catch(err => {
            console.log(err);
            res.status(417).json({ message: "Unexpected Error", status: false });
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Error Occurs", status: false });
        console.log(error);
    }
}

exports.ViewAllQuestions = (req = request, res = response) => {

    try {
        var page = Number(req.params.page) || 1;
        var limit = Number(req.params.limit) || 10;
        var offset = (page * limit) - limit;

        Question.find().populate("answers").skip(offset).limit(limit).then(data => {
            res.status(200).json({ data, status: true });
        }).catch(err => {
            console.log(err);
            res.status(417).json({ message: "Unexpected Error", status: false });
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Error Occurs", status: false });
        console.log(error);
    }
}

exports.AnswerQuestion = (req = request, res = response) => {

    try {
        const { id, answer } = req.body;
        Question.findById(id).then(data => {
            if (data) {
                var newAnswer = new Answer({ answer, doctorId: req.user_id });
                newAnswer.save().then(async answeredData => {
                    data.answers.push(answeredData._id);
                    await data.save();
                    res.status(200).json({ message: "Answered Successfully", data: answeredData, status: true });
                }).catch(err => {
                    console.log(err);
                    res.status(417).json({ message: "Unexpected Error", status: false });
                })
            } else {
                res.status(404).json({ message: "Id Not Found", status: false });
            }
        }).catch(err => {
            console.log(err);
            res.status(417).json({ message: "Unexpected Error", status: false });
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Error Occurs", status: false });
        console.log(error);
    }
}




