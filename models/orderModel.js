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
		enum: ["Pending", "Paid", "Failed"],
		default: "Pending",
		required: [true, "Payment status is required"],
	},

	orderDate:{
		type: Date,
		required: [true, "Order date is required"]
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
})

module.exports = new mongoose.model("Order", orderSchema);