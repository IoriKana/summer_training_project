const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Account = require("../models/accountModel");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { log } = require("console");

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

	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		return next(new AppError("No user found with that ID", STATUS.NOT_FOUND));
	}


	await Account.findByIdAndDelete(user.account);

	respond(res, STATUS.NO_CONTENT, null);
});

exports.setProfilePic =  catchAsync(async (req, res, next) => {
	const user = req.user
	const imageFile = req.file

	if (!imageFile) {
        return next(new AppError('No image file provided', STATUS.BAD_REQUEST));
	}
    
	try{
		const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image", folder: 'profilePics'})

		if (user.cloudinaryId) {
			await cloudinary.uploader.destroy(user.cloudinaryId);
		}

		user.profilePic = imageUpload.secure_url
		user.cloudinaryId = imageUpload.public_id

		await user.save()

		fs.unlinkSync(imageFile.path)

		respond(res, STATUS.OK, "success", user)
	} catch (error){
		console.log(`the error is: ${error}`);
		return next(new AppError('Image upload failed', STATUS.INTERNAL_SERVER_ERROR));

	}

});

// exports.getProfile =  catchAsync(async (req, res, next) => {

// });