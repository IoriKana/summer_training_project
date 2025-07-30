const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
exports.getAllAccounts = catchAsync(async (req, res, next) => {
	const getData = await Account.find();
	respond(res, STATUS.OK, "data : ", getData);
});

exports.createAccount = catchAsync(async (req, res, next) => {
	const newAccount = await Account.create(req.body);
	if (!newAccount) {
		return next(
			new AppError("user can't be created", STATUS.INTERNAL_SERVER_ERROR)
		);
	}
	respond(res, STATUS.CREATED, "User has been created : ", newAccount);
});

exports.getByEmail = catchAsync(async (req, res, next) => {
	const getAccount = await Account.findOne({ email: req.body.email });

	if (!getAccount) {
		return next(new AppError("user can't be created", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.CREATED, "User has been created : ", newAccount);
});

exports.UpdateAccount = catchAsync(async (req, res, next) => {
	const UpdateAccount = await Account.findOneAndUpdate(
		{ email: req.params.email },
		req.body,
		{ new: true }
	);
	if (!UpdateAccount) {
		return next(
			new AppError("user can't be updated", STATUS.INTERNAL_SERVER_ERROR)
		);
	}
	respond(res, STATUS.OK, "User has been updated ", UpdateAccount);
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
	const userExists = await User.findOne({ email: req.params.email });
	if (!userExists) {
		return next(new AppError("User not found", 404));
	}
	await User.findOneAndDelete({ email: req.params.email });
	respond(res, STATUS.OK, "User has been updated ", userExists);
});
