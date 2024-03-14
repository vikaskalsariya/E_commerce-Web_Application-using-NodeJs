const mongoose =require("mongoose");

const cartSchema = mongoose.Schema({
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    quantity : {
        type : String,
        required: true
    },
    status : {
        type : String,
        default : "pending",
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

const Cart = mongoose.model("Cart",cartSchema);

module.exports = Cart;