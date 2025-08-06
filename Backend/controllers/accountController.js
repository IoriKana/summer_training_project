const Account = require("../models/accountModel");
const { catchAsync } = require("../utils/catchAsync");
const { respond } = require("../modules/helperMethods");
const { STATUS } = require("../modules/status");
const cloudinary = require("cloudinary").v2;
const AppError = require("../utils/appError");

const User = require("../models/userModel");
const Staff = require("../models/staffModel");

exports.getAllAccounts = catchAsync(async (req, res, next) => {
	const getData = await Account.find();
	respond(res, STATUS.OK, "data : ", getData);
});

exports.createAccount = catchAsync(async (req, res, next) => {
	const newAccount = await Account.create(req.body);
	if (!newAccount) {
		return next(
			new AppError("account can't be created", STATUS.INTERNAL_SERVER_ERROR)
		);
	}
	const newUser = await User.create({
		name: newAccount.userName,
		account: newAccount._id,
	});
	respond(res, STATUS.CREATED, "account has been created : ", {
		newAccount,
		newUser,
	});
});

exports.getById = catchAsync(async (req, res, next) => {
	const account = await Account.findById(req.account._id);

	if (!getAccount) {
		return next(new AppError("account has not been found", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "account has been found : ", account);
});

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

exports.updateMyAccount = catchAsync(async (req, res, next) => {
	const filteredBody = filterObj(req.body, "userName", "email");

	const updatedAccount = await Account.findByIdAndUpdate(
		req.account._id,
		filteredBody,
		{ new: true }
	);

	if (!updatedAccount) {
		return next(
			new AppError(
				"Account not found or could not be updated.",
				STATUS.NOT_FOUND
			)
		);
	}
	if (req.user && filteredBody.userName) {
		req.user.name = filteredBody.userName;
		await req.user.save({ validateBeforeSave: false });
	}

	respond(res, STATUS.OK, "Account has been updated", {
		account: updatedAccount,
	});
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
	const deletedAccount = await Account.findByIdAndDelete(req.account.id);

	if (!deletedAccount) {
		return next(
			new AppError("Account to be deleted was not found.", STATUS.NOT_FOUND)
		);
	}

	if (deletedAccount.role === "Staff" || deletedAccount.role === "Admin") {
		await Staff.findOneAndDelete({ account: deletedAccount._id });
	} else {
		await User.findOneAndDelete({ account: deletedAccount._id });
	}

	respond(res, STATUS.OK, "Account has been successfully deleted");
});

exports.updateProfilePicture = catchAsync(async (req, res, next) => {
	const account = await Account.findById(req.user.account._id);

	if (!req.cloudinary) {
		return next(
			new AppError(
				"Image upload failed, no file data received.",
				STATUS.BAD_REQUEST
			)
		);
	}

	if (account.cloudinary_id) {
		await cloudinary.uploader.destroy(account.cloudinary_id);
	}

	account.profile_image_url = req.cloudinary.secure_url;
	account.cloudinary_id = req.cloudinary.public_id;

	await account.save({ validateBeforeSave: false });

	respond(res, STATUS.OK, "Profile picture updated successfully", account);
});
