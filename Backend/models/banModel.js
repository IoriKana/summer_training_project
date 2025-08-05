const mongoose = require("mongoose");

const banSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Account",
		},
		staffId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Account",
		},
		banDuration: {
			type: Date,
		},
		banReason: {
			type: String,
			default:
				"You have been banned by the administration. Please contact us via our email: eapp2035@gmail.com , Thank You",
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);

const banModel = new mongoose.model("Ban", banSchema);
module.exports = banModel;
