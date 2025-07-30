const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const { catchAsync } = require("../utils/catchAsync"); // NECESSARY: For consistent error handling.
const AppError = require("../utils/appError"); // NECESSARY: For consistent error handling.
const User = require("../models/userModel");
const Account = require("../models/accountModel"); // NECESSARY: For deleting associated accounts.

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const userList = await User.find().populate("account");
	respond(res, STATUS.OK, "All users retrieved", userList);
});

exports.getUserByID = catchAsync(async (req, res, next) => {
	// FIXED: Added 'await' to ensure the database query completes.
	const user = await User.findById(req.params.id).populate("account");

	if (!user) {
        // FIXED: Using AppError for consistent error handling across the application.
		return next(new AppError("No user found with that ID", STATUS.NOT_FOUND));
	}

	respond(res, STATUS.OK, "User found", user);
});

/*
 * NECESSARY CHANGE: The 'createUser' logic should not be here.
 * This was correctly implemented in your authController's 'signUp' function.
 * Creating a user here would result in a User document without an associated Account,
 * which would corrupt your data and break the application.
 *
 * exports.createUser = async (req, res) => { ... };
 */

exports.updateUser = catchAsync(async (req, res, next) => {
    // FIXED: Switched to the more concise and standard findByIdAndUpdate method.
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
    // FIXED: Implemented a hard delete and added cleanup for the associated Account.
    // The previous "soft delete" logic was incomplete and would leave an orphaned Account document.
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		return next(new AppError("No user found with that ID", STATUS.NOT_FOUND));
	}

    // NECESSARY: This step is crucial for data integrity. It removes the associated account.
    await Account.findByIdAndDelete(user.account);

	respond(res, STATUS.NO_CONTENT, null);
});