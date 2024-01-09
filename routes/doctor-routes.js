const { Router } = require("express");
const AuthenticateDoctor = require("../middlewares/auth-doctor");
const { EditProfile, ViewAllAppoinment, ChangeAppoinmentStatus, AttendPatient, CreatePrescription, ViewAllMedicines, ViewPrescription, EditProfilePic, AnswerQuestion, ViewAllQuestions } = require("../controllers/DoctorController");
const { UploadImage } = require("../functions/functions");

const DoctorRouter = Router();

DoctorRouter.post("/editProfile", AuthenticateDoctor, EditProfile);
DoctorRouter.post("/editProfilePic", UploadImage.single("image"), AuthenticateDoctor, EditProfilePic);

DoctorRouter.get("/viewAllAppoinment", AuthenticateDoctor, ViewAllAppoinment);
DoctorRouter.post("/changeAppoinmentStatus", AuthenticateDoctor, ChangeAppoinmentStatus);
DoctorRouter.post("/attendPaitent", AuthenticateDoctor, AttendPatient);
DoctorRouter.post("/createPrescription", AuthenticateDoctor, CreatePrescription);
DoctorRouter.post("/viewPrescription", AuthenticateDoctor, ViewPrescription);
DoctorRouter.get("/viewAllMedicine", AuthenticateDoctor, ViewAllMedicines);
DoctorRouter.get("/viewAllQuestions", AuthenticateDoctor, ViewAllQuestions);
DoctorRouter.post("/answer", AuthenticateDoctor, AnswerQuestion);


module.exports = DoctorRouter;