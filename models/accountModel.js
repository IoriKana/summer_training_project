const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Account = new mongoose.Schema({
	user_name: {
		type: String,
	},

	password: {
		type: String,
		required: true,
		minLength: 6,
		select: false,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	phone_num: {
		type: String,
	},

	full_name: {
		first_name: {
			type: String,
		},
		last_name: {
			type: String,
		},
	},
});

Account.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

Account.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const AccountModel = mongoose.model("Account", Account);
module.exports = AccountModel;
