const { Router } = require("express");
const AuthenticatePatient = require("../middlewares/auth-patient");
const { BookAppoinment, CheckStatus, AskDoubts } = require("../controllers/PatientController");


const PatientRouter=Router();

PatientRouter.post("/bookAppoinment",AuthenticatePatient,BookAppoinment);
PatientRouter.get("/checkStatus",AuthenticatePatient,CheckStatus);
PatientRouter.post("/question",AuthenticatePatient,AskDoubts);

module.exports=PatientRouter;