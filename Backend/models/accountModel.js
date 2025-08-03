const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Account = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: [true, "UserName is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			validator: [validator.isEmail, "invalid Email"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minLength: 6,
			select: false,
			validator: [
				validator.isStrongPassword,
				"Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
			],
		},
		phoneNumber: {
			type: String,
		},
		role: {
			type: String,
			enum: {
				values: ["Customer", "Staff", "Admin"],
			},
			default: "Customer",
		},
		resetPasswordToken: {
		type : String,
		default:undefined
	},
	resetPasswordTokenExp :{
		type : Date,
		default:undefined
	},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);

Account.pre("save", async function (next) {
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

Account.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const AccountModel = new mongoose.model("Account", Account);
module.exports = AccountModel;
