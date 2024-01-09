const { request, response } = require("express");
const { VerifyToken } = require("../functions/functions");
const User = require("../models/User");


const AuthenticatePatient=(req=request,res=response,next)=>{
    const {authorization}=req.headers;
    if(authorization){
        const token=authorization.split(" ")[1];
        VerifyToken(token).then(decodedData=>{
            User.where({_id:decodedData.user_id}).findOne().then(data=>{
                if(data){
                    if(decodedData.role=="PATIENT"){
                        req.user_id=data._id;
                        next();
                    }else{
                        res.status(401).json({message:"Wrong Token Provided",status:false});
                    }
                }else{
                    res.status(401).json({message:"Wrong Token Provided",status:false});
                }
            }).catch(err=>{
                console.log(err);
                res.status(400).json({message:"Error",status:false});
            })
        }).catch(err=>{
            console.log(err);
            res.status(400).json({message:"Jwt Error",status:false});
        })
        
    }else{
        res.status(401).json({message:"Token Not Provided",status:false});
    }

}

module.exports=AuthenticatePatient;