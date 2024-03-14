const mongoose =require("mongoose");

const categorySchema = mongoose.Schema({
    category_name : {
        type : String,
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

const Category = mongoose.model("Category",categorySchema);

module.exports = Category;