const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const catchAsync = require("../utils/catchAsync");
const Staff = require("../models/staffModel");
const Account = require("../models/accountModel"); 
const AppError = require("../utils/appError"); 

exports.getAllStaff = catchAsync(async (req, res, next) => {
	const staffMembers = await Staff.find().populate("account");
	respond(res, STATUS.OK, "All staff members", staffMembers);
});

exports.getStaff = catchAsync(async (req, res, next) => {
	const staffMember = await Staff.findById(req.params.id).populate(
		"account"
	);

	if (!staffMember) {
		return next(new AppError("No staff member found with that ID", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "Staff member found", staffMember);
});


exports.updateStaff = catchAsync(async (req, res, next) => {
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
	const staffMember = await Staff.findByIdAndDelete(req.params.id);

	if (!staffMember) {
		return next(new AppError("No staff member found with that ID", STATUS.NOT_FOUND));
	}

    await Account.findByIdAndDelete(staffMember.account);

	respond(res, STATUS.NO_CONTENT, null);
});