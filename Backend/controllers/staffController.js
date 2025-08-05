const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const { catchAsync } = require("../utils/catchAsync");
const Staff = require("../models/staffModel");
const Account = require("../models/accountModel");
const AppError = require("../utils/appError");
const Ban = require("../models/banModel");

function isLetter(str) {
	return str.length === 1 && str.match(/[a-z]/i);
}

exports.getAllStaff = catchAsync(async (req, res, next) => {
	const staffMembers = await Staff.find().populate("account");
	respond(res, STATUS.OK, "All staff members", staffMembers);
});

exports.getStaff = catchAsync(async (req, res, next) => {
	const staffMember = await Staff.findById(req.params.id).populate("account");

	if (!staffMember) {
		return next(
			new AppError("No staff member found with that ID", STATUS.NOT_FOUND)
		);
	}
	respond(res, STATUS.OK, "Staff member found", staffMember);
});
const toMilliseconds = (hrs, min, sec) =>
	(hrs * 60 * 60 + min * 60 + sec) * 1000;

exports.banUser = catchAsync(async (req, res, next) => {
	const { userId, banReason } = req.body;
	let banDuration = String(req.body.banDuration) || undefined;
	//try now
	if (banDuration !== undefined) {
		if (banDuration.endsWith("d")) {
			const days = parseInt(banDuration.replace("d", ""), 10);
			banDuration = toMilliseconds(24 * days, 0, 0) + Date.now();
		} else if (banDuration.endsWith("h")) {
			const hours = parseInt(banDuration.replace("h", ""), 10);
			banDuration = toMilliseconds(hours, 0, 0) + Date.now();
		} else if (banDuration.endsWith("m")) {
			const minutes = parseInt(banDuration.replace("m", ""), 10);
			banDuration = toMilliseconds(0, minutes, 0) + Date.now();
		} else {
			return next(
				new AppError("banDuration is not in correct form", STATUS.BAD_REQUEST)
			);
		}

		//
	}

	if (!userId || !banReason) {
		return next(
			new AppError("must enter The userId and banReason", STATUS.BAD_REQUEST)
		);
	}

	const user = await Account.findById(userId);
	if (!user) {
		return next(new AppError("User not found ", STATUS.BAD_REQUEST));
	}
	if (
		req.account.role === "Admin" ||
		(user.role === "Staff" && req.account.role === "Admin") ||
		(req.account.role === "Staff" && user.role === "Customer")
	) {
		const banUser = await Ban.create({
			userId: userId,
			staffId: req.account._id,
			banDuration: banDuration,
			banReason: banReason,
		});

		return respond(
			res,
			STATUS.OK,
			"The account has been successfully banned.",
			{ userInfo: banUser }
		);
	}
	return next(
		new AppError(
			"Access denied: You do not have the required permissions to perform this action.",
			STATUS.UNAUTHORIZED
		)
	);
});

exports.unbanAccount = catchAsync(async (req, res, next) => {
	const userId = req.body.userId; //here
	if (!userId) {
		return next(new AppError("must enter the userId :", STATUS.BAD_REQUEST));
	}
	const user = await Account.findById(userId); //
	if (!user) {
		return next(new AppError("Account not found ", STATUS.BAD_REQUEST));
	}
	if (req.account.role === "Admin" || req.account.role === "Staff") {
		const unbannedUser = await Ban.findOneAndDelete({ userId: user._id });
		return respond(
			res,
			STATUS.OK,
			"The account has been successfully unbanned.",
			{ userInfo: unbannedUser }
		);
	}
	return next(
		new AppError(
			"Access denied: You do not have the required permissions to perform this action.",
			STATUS.UNAUTHORIZED
		)
	);
});
exports.updateStaff = catchAsync(async (req, res, next) => {
	const staffMember = await Staff.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!staffMember) {
		return next(
			new AppError("No staff member found with that ID", STATUS.NOT_FOUND)
		);
	}
	respond(res, STATUS.OK, "Staff member updated", staffMember);
});

exports.deleteStaff = catchAsync(async (req, res, next) => {
	const staffMember = await Staff.findByIdAndDelete(req.params.id);

	if (!staffMember) {
		return next(
			new AppError("No staff member found with that ID", STATUS.NOT_FOUND)
		);
	}

	await Account.findByIdAndDelete(staffMember.account);

	respond(res, STATUS.NO_CONTENT, null);
});
