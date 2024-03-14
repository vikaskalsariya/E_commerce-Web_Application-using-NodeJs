const mongoose =require("mongoose");

const exCategorySchema = mongoose.Schema({
    ex_category_name : {
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

const ExtraCategory = mongoose.model("ExtraCategory",exCategorySchema);

module.exports = ExtraCategory;