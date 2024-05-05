const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    category :{
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

const Category = mongoose.model('Category',CategorySchema);

module.exports = Category;