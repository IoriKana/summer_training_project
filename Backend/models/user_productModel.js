const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
	accountID: {
		// Changed from userID
		type: mongoose.Schema.Types.ObjectId,
		ref: "Account", // Changed from User
		required: [true, "Account id is required!"],
	},
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: [true, "Product id is required!"],
	},
	review: {
		type: String,
		minLength: [3, "Your review must at least 3 chars!"],
		maxLength: [250, "Your review cannot exceed 200 chars!"],
	},
	stars: {
		type: Number,
		enum: [1, 2, 3, 4, 5],
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

reviewSchema.index({ accountID: 1, productId: 1 }, { unique: true });

module.exports = new mongoose.model("Review", reviewSchema);
