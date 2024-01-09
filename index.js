const express = require("express");
const connection = require("./database/connection");
const AuthRouter = require("./routes/auth-routes");
const Role = require("./models/Role");
const fs = require("fs");
const Medicine = require("./models/Medicine");
const AdminRouter = require("./routes/admin-routes");
const DoctorRouter = require("./routes/doctor-routes");
const PatientRouter = require("./routes/patient-routes");
const { RegisterValidation } = require("./functions/validation");
const User = require("./models/User");

const app = express();
app.use(express.json());

connection();

app.use("/api/auth", AuthRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/doctor", DoctorRouter);
app.use("/api/patient", PatientRouter);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hii Hello world", status: true });
})

app.post("/addrole", (req, res) => {
    const { role } = req.body;
    const newRole = new Role({ roleName: String(role).toUpperCase() });
    newRole.save().then(data => {
        res.status(200).json({ message: "Role created Successfully", status: true });
    }).catch(err => {
        res.status(417).json({ message: "Error", status: false });
    })

})

app.get("/addMedicine", (req, res) => {
    fs.readFile("./medicine_data.json", 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            res.send({ message: "error occured" });
        } else {
            data = JSON.parse(data);
            data.map(async medicine => {
                await Medicine.findOneAndUpdate({ medicineName: medicine.medicineName }, medicine, { upsert: true, new: true });
            })
            res.send(data);
        }
    })
})

app.post("/addAdmin", (req, res) => {
    try {
        const { value, error } = RegisterValidation.validate(req.body);
        if (!error) {
            User.where({ username: value.username }).findOne().then(async data => {
                if (data) {
                    res.status(302).json({ message: `Username ${data.username} is already Found` });
                } else {
                    const roleData = await Role.where({ roleName: "ADMIN" }).findOne().exec();
                    if (!roleData) {
                        res.status(200).json({ message: "Role Not correctly Maintained or Not Exists", status: false });
                        return;
                    }
                    value.roleId = roleData._id;
                    const newUser = new User(value);
                    newUser.save().then(savedData => {
                        const token = CreateJwt({ user_id: savedData._id, name: savedData.name, role: "ADMIN" });
                        res.status(201).json({ message: "ADMIN Created Successfully", status: true, token });
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
})


app.listen(3000, () => {
    console.log("Server Started ......")
})





