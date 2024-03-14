const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const imagePath = "/uploads/admin";

const adminSchema = mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    password : {
        type : String,
        required: true
    },
    gender : {
        type : String,
        required: true
    },
    hobby : {
        type : Array,
        required: true
    },
    city : {
        type : String,
        required: true
    },
    description : {
        type : String,
        required: true
    },
    adminImage : {
        type : String,
        required: true
    },
    role : {
        type : String,
        default : "admin",
        required : true
    },
    isActive : {
        type : String,
        required: true
    },
    createdDate : {
        type : String,
        required: true
    },
    updatedDate : {
        type : String,
        required: true
    }
});

const imageStorage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,path.join(__dirname,"..",imagePath))
    },
    filename : (req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }
})

adminSchema.statics.uploadAdminImage = multer({storage : imageStorage}).single("adminImage");
adminSchema.statics.imagePath = imagePath;

const Admin = mongoose.model("Admin",adminSchema);

module.exports = Admin;