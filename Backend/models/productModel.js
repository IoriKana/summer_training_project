const mongoose = require("mongoose");
const prodcutSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product Name is required"],
		minlength: 6,
	},
	price: {
		type: Number,
		required: [true, "Price is required"],
	},
	description: {
		type: String,
		minlength: 20,
		maxlength: 200,
	},
	stock: {
		type: Number,
		min: 0,
		required: [true, "stock is required "],
	},
	StaffId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Staff",
		required: [true, "Staff id is required"],
	},
});
const ProductModel = new mongoose.model("Product", prodcutSchema);
module.exports = ProductModel;
