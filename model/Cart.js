const mongoose = require('mongoose');
const ProductSchema = mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true,
    },
    productId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        require : true,
    },
    status :{
        type : String,
        require : true,
    },
    quantity:{
        type : Number,
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
    createDate :{
        type : String,
        require : true,
    },
    updateDate :{
        type : String,
        require : true,
    },
});

const Cart = mongoose.model('Cart',ProductSchema);

module.exports = Cart;