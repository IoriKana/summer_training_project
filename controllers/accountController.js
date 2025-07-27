const Account = require("../models/accountModel");
const { catchAsync } = require("../utils/catchAsync");
const { respond } = require("../modules/helperMethods");
const { STATUS } = require("../modules/status");
const AppError = require("../utils/appError");

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

exports.getByEmail = catchAsync(async (req, res, next) => {
	const getAccount = await Account.findOne({ email: req.params.email });

	if (!getAccount) {
		return next(new AppError("account has not been found", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "account has been found : ", getAccount);
});

exports.UpdateAccount = catchAsync(async (req, res, next) => {
	const UpdateAccount = await Account.findOneAndUpdate(
		{ email: req.account.email },
		req.body,
		{ new: true }
	);
	if (!UpdateAccount) {
		return next(
			new AppError("account can't be updated", STATUS.INTERNAL_SERVER_ERROR)
		);
	}
	respond(res, STATUS.OK, "account has been updated ", UpdateAccount);
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
	const accountExists = await Account.findOne({ email: req.account.email });
	if (!accountExists) {
		return next(new AppError("account not found", STATUS.NOT_FOUND));
	}
	await Account.findOneAndDelete({ email: req.account.email });
	respond(res, STATUS.OK, "account has been deleted ", accountExists);
});
