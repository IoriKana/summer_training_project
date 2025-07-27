const Account = require("../models/accountModel");
const appError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { STATUS } = require("../modules/status");
const { respond } = require("../modules/helperMethods");
const Staff = require("../models/staffModel");
const User = require("../models/userModel");


const signToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

// signing up as a regular user, not an admin
exports.signUp = catchAsync(async (req, res, next) => {
	const { userName, email, password, phoneNumber } = req.body;

	const newAccount = await Account.create({
		userName,
		email,
		password,
		phoneNumber,
		role: "Customer",
	});

	const newUser = await User.create({
		name: newAccount.userName,
		account: newAccount._id,
	});

	const token = signToken({ email: newAccount.email, role: newAccount.role });
	respond(res, STATUS.CREATED, "success", {
		account: newAccount,
		user: newUser,
		token,
	});
});

exports.createStaff = catchAsync(async (req, res, next) => {
	// Check if the admin's email matches the one in .env
	if (req.account.email !== process.env.ADMIN_EMAIL) {
		return next(
			new appError(
				"Only the main admin can create staff accounts",
				STATUS.FORBIDDEN
			)
		);
	}
	const { userName, email, password, phoneNumber } = req.body;
	const newAccount = await Account.create({
		userName,
		email,
		password,
		phoneNumber,
		role: "Staff",
	});

	let newStaff = await Staff.create({
		name: newAccount.userName,
		account: newAccount._id,
	});

	const token = signToken({ email: newAccount.email, role: newAccount.role });
	respond(res, STATUS.CREATED, "staff account created", {
		account: newAccount,
		staff: newStaff,
		token,
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(
			new appError("please provide email and password", STATUS.BAD_REQUEST)
		);
	}
	const account = await Account.findOne({ email }, "+password");
	if (!account || !(await account.comparePassword(password))) {
		return next(
			new appError("incorrcet email or password", STATUS.UNAUTHORIZED)
		);
	}
	const token = signToken({ email: account.email, role: account.role });
	respond(res, STATUS.OK, "success", { account, token });
});

exports.protect = catchAsync(async (req, res, next) => {
	// Debug: log the Authorization header
	console.log("Authorization header:", req.headers.authorization);
	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith("Bearer")
	) {
		return next(
			new appError(
				"You are not logged in! please log in to get access",
				STATUS.UNAUTHORIZED
			)
		);
	}
	const token = req.headers.authorization.split(" ")[1];
	// Debug: log the token value
	console.log("Token value:", token);
	const decode = await jwt.verify(token, process.env.JWT_SECRET);
	const account = await Account.findOne({ email: decode.email });
	if (!account) {
		return next(new appError("account no longer exists", STATUS.NOT_FOUND));
	}
	req.account = account;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.account.role)) {
			return next(
				new appError(
					"You do not have permission to perform this action",
					STATUS.FORBIDDEN
				)
			);
		}
		next();
	};
};
