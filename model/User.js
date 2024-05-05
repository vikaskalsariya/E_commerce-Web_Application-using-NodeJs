const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
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
    mNumber : {
        type : Number,
        require : true,
    },
    role:{
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
});


const User = mongoose.model('User',UserSchema);

module.exports = User;