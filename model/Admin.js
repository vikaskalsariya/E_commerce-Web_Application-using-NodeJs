const mongoose = require('mongoose');
const multer  = require('multer');

const path = require('path');

const AdminImgPath = '/upload/addAdmin';

const AdminSchema = mongoose.Schema({
    name :{
        type : String,
        require : true,
    },
    email :{
        type : String,
        require : true,
    },
    password :{
        type : String,
        require : true,
    },
    gender :{
        type : String,
        require : true,
    },
    dob :{
        type : String,
        require : true,
    },
    mNumber : {
        type : Number,
        require : true,
    },
    discretion :{
        type : String,
        require : true,
    },
    Admin_Image : {
        type : String,
        require : true,
    },
    isActive :{
        type : Boolean ,
        require : true,
    },
    createDate :{
        type : String,
        require : true,
    },
    updateDate :{
        type : String,
        require : true,
    },
    role :{
        type:String,
        require : true
    }
});

const AdminUploadImg = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,path.join(__dirname,"..",AdminImgPath));
    },
    filename : (req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }
})

AdminSchema.statics.AdminImg = multer({storage:AdminUploadImg}).single('adminImage');
AdminSchema.statics.AdminImgPath = AdminImgPath;

const Admin = mongoose.model('Admin',AdminSchema);

module.exports = Admin;