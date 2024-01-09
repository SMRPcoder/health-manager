const { request, response } = require("express");
const Medicine = require("../models/Medicine");
const { RegisterMedicineValidation, RegisterValidation } = require("../functions/validation");
const User = require("../models/User");
const Role = require("../models/Role");
const { CreateJwt } = require("../functions/functions");

// ============================================== ---------medicine---------=============================
exports.AddMedicine = (req = request, res = response) => {
    try {
        const { value, error } = RegisterMedicineValidation.validate(req.body);
        if (!error) {
            Medicine.findOneAndUpdate({ medicineName: value.medicineName }, value, { upsert: true, new: true }).then(data => {
                res.status(200).json({ message: "Medicine Successfully Added", status: true, data });
            }).catch(err => {
                console.log(err);
                res.status(417).json({ message: "Unexpected Error", status: false });
            })
        } else {
            res.status(206).json({ message: error.message, status: false });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Happend", status: false });
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

exports.LowStockMedicine=(req = request, res = response) => {
    try {
        var below=Number(req.params.below)||100;
        var page = Number(req.params.page) || 1;
        var limit = Number(req.params.limit) || 10;
        var offset = (page * limit) - limit;
        Medicine.where({quantity:{$lte:below}}).limit(limit).skip(offset).find().sort({quantity:1}).then(data=>{
            res.status(200).json({data,status:true});
        }).catch(err => {
            console.log(err);
            res.status(417).json({ message: "Unexpected Error", status: false });
        })
        
    } catch (error) {
        res.status(500).json({ message: "Internal Error Occurs", status: false });
        console.log(error);
    }
}

//for doctor

exports.CreateDoctor = (req = request, res = response) => {
    try {
        const { value, error } = RegisterValidation.validate(req.body);
        if (!error) {
            User.where({ username: value.username }).findOne().then(async data => {
                if (data) {
                    res.status(302).json({ message: `Username ${data.username} is already Found` });
                } else {
                    const roleData = await Role.where({ roleName: "DOCTOR" }).findOne().exec();
                    if (!roleData) {
                        res.status(200).json({ message: "Role Not correctly Maintained or Not Exists", status: false });
                        return;
                    }
                    value.roleId = roleData._id;
                    const newUser = new User(value);
                    newUser.save().then(async savedData => {
                        const token = CreateJwt({ user_id: savedData._id, name: savedData.name, role: "DOCTOR" });
                        res.status(201).json({ message: "User Created Successfully", status: true, token });
                    }).catch(err => {
                        console.log(err);
                        res.status(417).json({ message: "Unexpected Error", status: false });
                    })
                }
            }).catch(err => {
                console.log(err);
                res.status(417).json({ message: "Unexpected Error", status: false });
            })

        } else {
            res.status(206).json({ message: error.message, status: false });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Error Occurs", status: false });
        console.log(error);
    }
}

exports.viewAllDoctor=(req = request, res = response) => {
    try {
        var page = Number(req.params.page) || 1;
        var limit = Number(req.params.limit) || 10;
        var offset = (page * limit) - limit;

        Role.where({roleName:"DOCTOR"}).findOne().then(roledata=>{
            if(roledata){
                User.where({roleId:roledata._id}).limit(limit).skip(offset).find().then(data=>{
                    res.status(200).json({data,status:true});
                }).catch(err => {
                    console.log(err);
                    res.status(417).json({ message: "Unexpected Error", status: false });
                })
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

exports.viewDoctor=(req = request, res = response) => {
    try {
        const {id}=req.body;
        Role.where({roleName:"DOCTOR"}).findOne().then(roledata=>{
            if(roledata){
                User.where({_id:id,roleId:roledata._id}).findOne().then(data=>{
                    if(data){
                        res.status(200).json({data,status:true});
                    }else{
                        res.status(404).json({message:"Id Not Found",status:false});
                    }
                }).catch(err => {
                    console.log(err);
                    res.status(417).json({ message: "Unexpected Error", status: false });
                })
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






