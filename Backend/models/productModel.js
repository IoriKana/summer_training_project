const mongoose = require("mongoose");
// maged
// shit
// this might be many to many
// each order have many item
// each item in many order
// :joy:
// can we do that in mongodb
// 
const prodcutSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product Name is required"],
		minlength: 1,
	},
	price: {
		type: Number,
		required: [true, "Price is required"],
	},
	description: {
		type: String,
		minlength: 1,
		maxlength: 200,
	},
	stock: {
		type: Number,
		min: 0,
		required: [true, "stock is required "],
	},
	staff: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Staff",
		required: [true, "Staff id is required"],
	},

	category:{
		type: String,
		enum: {values: [
			"groceries",
			"tech", 
			"sports", 
			"pet", 
			"books", 
			"games",
			"general"
		]},
		default: "general",
		required: [true, "category id is required"],
	}
});

const ProductModel = new mongoose.model("Product", prodcutSchema);
module.exports = ProductModel;
