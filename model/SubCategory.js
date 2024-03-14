const mongoose =require("mongoose");

const subCategorySchema = mongoose.Schema({
    sub_category_name : {
        type : String,
        required : true
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
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

const SubCategory = mongoose.model("SubCategory",subCategorySchema);

module.exports = SubCategory;