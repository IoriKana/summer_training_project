const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Account = require("../models/accountModel");
const cloudinary = require("cloudinary").v2;

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const userList = await User.find().populate("account");
	respond(res, STATUS.OK, "All users retrieved", userList);
});

exports.getUserByID = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.id).populate("account");
	if (!user) {
		return next(new AppError("No user found with that ID", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "User found", user);
});

exports.updateUser = catchAsync(async (req, res, next) => {
	const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!updatedUser) {
		return next(new AppError("No user found with that ID", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "User updated", updatedUser);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new AppError("No user found with that ID", STATUS.NOT_FOUND));
	}

	if (user.cloudinary_id) {
		await cloudinary.uploader.destroy(user.cloudinary_id);
	}

	await user.deleteOne();
	await Account.findByIdAndDelete(user.account);

	respond(res, STATUS.NO_CONTENT, null);
});

exports.updateProfilePicture = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	if (!req.cloudinary) {
		return next(
			new AppError(
				"Image upload failed, no file data received.",
				STATUS.BAD_REQUEST
			)
		);
	}

	if (user.cloudinary_id) {
		await cloudinary.uploader.destroy(user.cloudinary_id);
	}

	user.profile_image_url = req.cloudinary.secure_url;
	user.cloudinary_id = req.cloudinary.public_id;

	await user.save({ validateBeforeSave: false });

	respond(res, STATUS.OK, "Profile picture updated successfully", user);
});
