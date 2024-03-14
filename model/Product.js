const mongoose =require("mongoose");
const multer = require("multer");
const path = require("path");
const priImagePath = "/uploads/product/pri_image";
const multiImagePath = "/uploads/product/multi_image";

const productSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    price : {
        type : String,
        required : true
    },
    oldPrice : {
        type : String,
        required : true
    },
    desc : {
        type : String,
        required : true
    },
    colors : {
        type : Array,
        required : true
    },
    sizes : {
        type : Array,
        required : true
    },
    pri_image : {
        type : String,
        required : true
    },
    multi_images : {
        type : Array,
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
    brandId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Brand",
        required : true
    },
    typeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Type",
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

const imageStorage = multer.diskStorage({
    destination : (req,file,cb) => {
        if(file.fieldname == "pri_image"){
            cb(null, path.join(__dirname,"..",priImagePath));
        }
        else{
            cb(null, path.join(__dirname,"..",multiImagePath));
        }
    },
    filename : (req,file,cb) => {
        cb(null,file.fieldname+"-"+Math.round(Math.random()*1000000));
    } 
})

productSchema.statics.uploadProductImage = multer({ storage : imageStorage}).fields([ {name : 'pri_image',maxCount : 1}, {name : 'multi_image',maxCount : 5} ]);
productSchema.statics.priImagePath = priImagePath;
productSchema.statics.multiImagePath = multiImagePath;

const Product = mongoose.model("Product",productSchema);

module.exports = Product;