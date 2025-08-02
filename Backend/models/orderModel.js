const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = new mongoose.Schema({
	shippingStatus: {
		type: String,
		enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
		default: "Pending",
		required: [true, "Shipping status is required"],
	},

	paymentStatus: {
		type: String,
		enum: ["Pending", "Paid", "Canceled"],
		default: "Pending",
		required: [true, "Payment status is required"],
	},

	orderDate:{
		type: Date,
		required: [true, "Order date is required"],
		default: Date.now()
	},

	totalCost: {
		type: Number,
		required: [true, "Total cost is required"],
		min: [0, "Total cost cannot be negative"]
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	
	items: [
    {
    	productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product"
    	},
    	quantity: Number,
		price: Number,
    }
  ],

	address: {
		country: {
			type: String,
		},
		city: {
			type: String,
		},
		building: {
			type: String,
		},
	},
})

module.exports = new mongoose.model("Order", orderSchema);