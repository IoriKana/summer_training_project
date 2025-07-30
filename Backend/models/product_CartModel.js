const mongoose = require("mongoose");

const ProductCartSchema = mongoose.Schema({
    productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: [true,"must have ProductId"]
	},
    cartId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Cart",
		required: [true,"must have cartID"]
	},
    quantity:{
        type:Number,
        min:1,
    }
});

module.exports = new mongoose.model("ProductCart", ProductCartSchema);