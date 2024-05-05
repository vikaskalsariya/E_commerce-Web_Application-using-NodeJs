const mongoose = require('mongoose');
const multer  = require('multer');

const path = require('path');

const SingleImgPath = '/upload/product/singleImage';
const MultiImgPath = '/upload/product/multiImage';

const ProductSchema = mongoose.Schema({
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
    extracategoryId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Extracategory",
        require : true,
    },
    typeId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Type",
        require : true,
    },
    brandId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Brand",
        require : true,
    },
    name :{
        type : String,
        require : true,
    },
    price :{
        type : String,
        require : true,
    },
    oldPrice :{
        type : String,
        require : true,
    },
    size :{
        type : Array,
        require : true,
    },
    color :{
        type : Array,
        require : true,
    },
    singleProductImg : {
        type : String,
        require : true,
    },
    description : {
        type : String,
        require : true,
    },
    multiProductImg :{
        type : Array,
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

const ProductUploadImg = multer.diskStorage({
    
    destination : (req,file,cb)=>{
        if(file.fieldname == 'singleProduct')
        {
            cb(null,path.join(__dirname,"..",SingleImgPath));
        }
        else 
        {
            cb(null,path.join(__dirname,"..",MultiImgPath));
        }
    },
    filename : (req,file,cb)=>{
        cb(null,file.fieldname+"-"+Math.random()*100000000000);
    }
})

ProductSchema.statics.ProductImg = multer({storage:ProductUploadImg}).fields([{name:"singleProduct"},{name:"multiProduct"}]);
ProductSchema.statics.SingleImgPath = SingleImgPath;
ProductSchema.statics.MultiImgPath = MultiImgPath;

const Product = mongoose.model('Product',ProductSchema);

module.exports = Product;