const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Account",
		required: true,
	},
	address: {
		country: String,
		city: String,
		building: String,
	},
	gender: String,
	deleted: {
		type: Boolean,
		default: false,
	},
	profile_image_url: {
		type: String,
		default: null,
	},
	cloudinary_id: {
		type: String,
		default: null,
	},
});

UserSchema.pre(/^find/, function (next) {
	this.where({ deleted: { $ne: true } });
	next();
});

UserSchema.pre(/^find/, function (next) {
	if (this.getOptions().autopopulate === false) {
		return next();
	}
	this.populate("account");
	next();
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
