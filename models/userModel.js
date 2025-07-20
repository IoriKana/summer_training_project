const mongoose = require("mongoose");

const User = new mongoose.Schema({
	name: {
		type: String,
	},

	account_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Account",
		required: true,
	},

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

	gender: {
		type: String,
	},
});

const UserModel = mongoose.model("User", User);
module.exports = UserModel;
