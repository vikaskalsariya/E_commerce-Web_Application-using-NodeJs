const mongoose =require("mongoose");

const typeSchema = mongoose.Schema({
    type_name : {
        type : String,
        required : true
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    subCategoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "SubCategory",
        required : true
    },
    exCategoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "ExtraCategory",
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

const Type = mongoose.model("Type",typeSchema);

module.exports = Type;