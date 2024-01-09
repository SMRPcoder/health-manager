const { Router } = require("express");
const AuthenticateAdmin = require("../middlewares/auth-admin");
const { AddMedicine, CreateDoctor, ViewAllMedicines, LowStockMedicine, viewAllDoctor, viewDoctor } = require("../controllers/AdminController");


const AdminRouter=Router();

AdminRouter.post("/addMedicine",AuthenticateAdmin,AddMedicine);
AdminRouter.post("/addDoctor",AuthenticateAdmin,CreateDoctor);
AdminRouter.get("/viewAllDoctor",AuthenticateAdmin,viewAllDoctor);
AdminRouter.post("/viewDoctor",AuthenticateAdmin,viewDoctor);
AdminRouter.get("/viewAllMedicine",AuthenticateAdmin,ViewAllMedicines);
AdminRouter.get("/lowStockMedicines",AuthenticateAdmin,LowStockMedicine);


module.exports=AdminRouter