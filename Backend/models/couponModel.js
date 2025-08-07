const mongoose = require("mongoose");
const couponschema = mongoose.Schema({
	text: {
		type: String,
		required: [true, "Must enter the coupon string :"],
		unique: true,
	},

	discount: {
		type: Number,
		required: true,
	},

	creationDate: {
		type: Date,
		default: Date.now(),
	},
	expirationDate: {
		type: Date,
		default: () => Date.now() + 2 * 24 * 60 * 60 * 1000,
	},

	minPrice: {
		type: Number,
		default: 0,
	},

	maximumUse: {
		type: Number,
		default: undefined,
		min: 0,
	},

	timesUsed: {
		type: Number,
		min: 0,
	},

	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Account",
	},
});

module.exports = new mongoose.model("coupon", couponschema);
