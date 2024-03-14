const mongoose =require("mongoose");

const orderSchema = mongoose.Schema({
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
        default : "confirm",
        required: true
    }
});

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;