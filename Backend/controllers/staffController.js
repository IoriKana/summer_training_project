const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const catchAsync = require("../utils/catchAsync");
const Staff = require("../models/staffModel");
const Account = require("../models/accountModel"); // Required for cleanup on delete
const AppError = require("../utils/appError"); // Required for error handling

exports.getAllStaff = catchAsync(async (req, res, next) => {
	const staffMembers = await Staff.find().populate("account");
	respond(res, STATUS.OK, "All staff members", staffMembers);
});

exports.getStaff = catchAsync(async (req, res, next) => {
    // FIXED: The query now correctly finds a staff member by their unique _id,
    // which is the standard RESTful approach. The previous query by email
    // on the Staff model was incorrect as the email field belongs to the Account model.
	const staffMember = await Staff.findById(req.params.id).populate(
		"account"
	);

	if (!staffMember) {
        // Using AppError for consistency in error handling
		return next(new AppError("No staff member found with that ID", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "Staff member found", staffMember);
});

/*
 * NECESSARY CHANGE: The 'createStaff' logic should not live in this controller.
 * It was correctly implemented in your authController because creating a staff member
 * requires creating BOTH an Account and a Staff document, and often involves
 * issuing a token. Handling it here would lead to incomplete data.
 * This function should be removed from this controller and its route.
 *
 * exports.createStaff = catchAsync(async (req, res, next) => {
 *	 const newStaff = await Staff.create(req.body);
 *	 respond(res, STATUS.CREATED, newStaff);
 * });
 */


exports.updateStaff = catchAsync(async (req, res, next) => {
    // This function is already using the correct method (findByIdAndUpdate) and needs no changes.
	const staffMember = await Staff.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
        runValidators: true
	});

	if (!staffMember) {
		return next(new AppError("No staff member found with that ID", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "Staff member updated", staffMember);
});

exports.deleteStaff = catchAsync(async (req, res, next) => {
    // FIXED: Added logic to delete the associated Account to prevent orphaned data.
    // This is a necessary change for maintaining database integrity.
	const staffMember = await Staff.findByIdAndDelete(req.params.id);

	if (!staffMember) {
		return next(new AppError("No staff member found with that ID", STATUS.NOT_FOUND));
	}

    // Cleanup Step: Delete the associated account.
    await Account.findByIdAndDelete(staffMember.account);

	respond(res, STATUS.NO_CONTENT, null);
});