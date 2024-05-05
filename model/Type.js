const mongoose = require('mongoose');

const SubcategorySchema = mongoose.Schema({
    type :{
        type : String,
        require : true,
    },
    extracategoryId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Extracategory",
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

const Type = mongoose.model('Type',SubcategorySchema);

module.exports = Type;