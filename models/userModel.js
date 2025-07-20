const mongoose = require("mongoose");

const User = new mongoose.Schema({
	name: {
		type: String,
	},

	account: {
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

	deleted: {
		type: Boolean,
		default: false,
	},
});

User.pre(/^find/, function (next) {
	this.where({ deleted: { $ne: true } });
	next();
});

User.pre(/^find/, function (next) {
	if (this.getOptions().autopopulate === false) {
		return next();
	}
	this.populate("account");
	next();
});

const UserModel = mongoose.model("User", User);
module.exports = UserModel;
