const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const catchAsync = require("../utils/catchAsync");
const Staff = require("../models/staffModel");

exports.getAllStaff = catchAsync(async (req, res, next) => {
	const staffMembers = await Staff.find().populate("account");
	respond(res, STATUS.OK, staffMembers);
});

exports.getStaff = catchAsync(async (req, res, next) => {
	const staffMember = await Staff.findOne({ email: req.params.email }).populate(
		"account"
	);
	if (!staffMember) {
		return respond(res, STATUS.NOT_FOUND, {
			message: "Staff member not found",
		});
	}
	respond(res, STATUS.OK, staffMember);
});

exports.createStaff = catchAsync(async (req, res, next) => {
	const newStaff = await Staff.create(req.body);
	respond(res, STATUS.CREATED, newStaff);
});

exports.updateStaff = catchAsync(async (req, res, next) => {
	const staffMember = await Staff.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	if (!staffMember) {
		return respond(res, STATUS.NOT_FOUND, {
			message: "Staff member not found",
		});
	}
	respond(res, STATUS.OK, staffMember);
});

exports.deleteStaff = catchAsync(async (req, res, next) => {
	const staffMember = await Staff.findByIdAndDelete(req.params.id);
	if (!staffMember) {
		return respond(res, STATUS.NOT_FOUND, {
			message: "Staff member not found",
		});
	}
	respond(res, STATUS.NO_CONTENT, null);
});
