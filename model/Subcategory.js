const mongoose = require('mongoose');

const SubcategorySchema = mongoose.Schema({
    subcategory :{
        type : String,
        require : true,
    },
    categoryId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
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

const Subcategory = mongoose.model('Subcategory',SubcategorySchema);

module.exports = Subcategory;