const mongoose = require('mongoose');

const SubcategorySchema = mongoose.Schema({
    extracategory :{
        type : String,
        require : true,
    },
    categoryId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        require : true,
    },
    subcategoryId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subcategory",
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

const Extracategory = mongoose.model('Extracategory',SubcategorySchema);

module.exports = Extracategory;