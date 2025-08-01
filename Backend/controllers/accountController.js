const Account = require("../models/accountModel");
const { catchAsync } = require("../utils/catchAsync");
const { respond } = require("../modules/helperMethods");
const { STATUS } = require("../modules/status");
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

exports.getByEmail = catchAsync(async (req, res, next) => {
	const getAccount = await Account.findOne({ email: req.params.email });

	if (!getAccount) {
		return next(new AppError("account has not been found", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "account has been found : ", getAccount);
});

exports.UpdateAccount = catchAsync(async (req, res, next) => {

	const updatedAccount = await Account.findByIdAndUpdate(
		req.account.id,
		req.body,
		{ new: true, runValidators: true } 
	);

	if (!updatedAccount) {
		
		return next(
			new AppError("Account not found or could not be updated.", STATUS.NOT_FOUND)
		);
	}
	respond(res, STATUS.OK, "Account has been updated", updatedAccount);
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
	const deletedAccount = await Account.findByIdAndDelete(req.account.id);

	if (!deletedAccount) {
		return next(new AppError("Account to be deleted was not found.", STATUS.NOT_FOUND));
	}

  
    if (deletedAccount.role === 'Staff' || deletedAccount.role === 'Admin') {
        await Staff.findOneAndDelete({ account: deletedAccount._id });
    } else {
        await User.findOneAndDelete({ account: deletedAccount._id });
    }

	respond(res, STATUS.OK, "Account has been successfully deleted");
});