const { request, response } = require("express");
const { RegisterValidation } = require("../functions/validation");
const User = require("../models/User");
const { CreateJwt } = require("../functions/functions");
const Role = require("../models/Role");


exports.Register = (req = request, res = response) => {
    try {
        const { value, error } = RegisterValidation.validate(req.body);
        if (!error) {
            User.where({ username: value.username }).findOne().then(async data => {
                if (data) {
                    res.status(302).json({ message: `Username ${data.username} is already Found` });
                } else {
                    const roleData=await Role.where({roleName:"PATIENT"}).findOne().exec();
                    if(!roleData){
                        res.status(200).json({message:"Role Not correctly Maintained or Not Exists",status:false});
                        return;
                    }
                    value.roleId=roleData._id;
                    const newUser = new User(value);
                    newUser.save().then(savedData => {
                        const token = CreateJwt({ user_id: savedData._id, name: savedData.name, role: "PATIENT" });
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
};


exports.Login = (req = request, res = response) => {
    try {
        const {username,password}=req.body;
        User.where({username}).findOne().populate("roleId").then(async (data)=>{
            if(data){
                if(await data.verifyPassword(password)){
                    const token = CreateJwt({ user_id: data._id, name: data.name, role: data.roleId.roleName });
                    res.status(200).json({ message: "Loggedin Successfully", status: true, token });
                }else{
                    res.status(406).json({message:"Password Missmatch",status:false});
                }
            }else{
                res.status(404).json({message:"Username Not Found",status:false})
            }
        }).catch(err=>{
            console.log(err);
            res.status(417).json({message:"Unexpected Error",status:false});
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error Occured", status: false });
    }
}