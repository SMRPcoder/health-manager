const { default: mongoose } = require("mongoose");
require("dotenv").config();

var username=process.env.MONGO_USER;
var password=process.env.MONGO_PASSWORD;
var db=process.env.MONGO_DB;

const uri=`mongodb+srv://${username}:${password}@cluster0.lvpiawy.mongodb.net/${db}?retryWrites=true&w=majority`;

const connection=()=>mongoose.connect(uri).then(()=>{
    console.log("Connection established successfully");
}).catch(err=>{
    console.error(err);
});

module.exports=connection;