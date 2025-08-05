const Account = require("../models/accountModel");
const appError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { STATUS } = require("../modules/status");
const { respond } = require("../modules/helperMethods");
const Staff = require("../models/staffModel");
const User = require("../models/userModel");
const countries = require("../utils/countries");
const { sendEmail } = require("../modules/senderModule");
const crypto = require("crypto");

const signToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signUp = catchAsync(async (req, res, next) => {
	const { userName, email, password, phoneNumber, country, City, Building } =
		req.body;

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
		address: {
			country: country,
			city: City,
			building: Building,
		},
	});

	const token = signToken({ id: newAccount._id, role: newAccount.role });

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	};
	res.cookie("jwt", token, cookieOptions);

	respond(res, STATUS.CREATED, "success", {
		account: newAccount,
		user: newUser,
		token,
	});
});

exports.createStaff = catchAsync(async (req, res, next) => {
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

	const newStaff = await Staff.create({
		name: newAccount.userName,
		account: newAccount._id,
	});

	const token = signToken({ id: newAccount._id, role: newAccount.role });
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
			new appError("incorrect email or password", STATUS.UNAUTHORIZED)
		);
	}

	const token = signToken({ id: account._id, role: account.role });
	const cookieOptions = {
		expires: new Date(
			Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
		),
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	};

	res.cookie("jwt", token, cookieOptions);

	account.password = undefined;

	respond(res, STATUS.OK, "Success", { account: account, token });
});

exports.logout = (req, res) => {
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 5 * 1000), // 5 seconds
		httpOnly: true,
	});

	res.status(200).json({ status: "success" });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	const { email } = req.body;

	if (!email) {
		return next(
			new appError("Please provide an email address", STATUS.BAD_REQUEST)
		);
	}

	const checkEmail = await Account.findOne({ email });
	if (!checkEmail) {
		return next(new appError("Email Not Found", STATUS.NOT_FOUND));
	}

	const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

	const hashedToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	try {
		await Account.findByIdAndUpdate(checkEmail._id, {
			resetPasswordToken: hashedToken,
			resetPasswordExpires: Date.now() + 10 * 60 * 1000,
		});

		const resetMessage = `This is an automatically generated e-mail from E-Commerce.\n\n————————————\nThank you for using a E-Commerce Account.\n\nPlease enter the following verification code to complete the e-mail address verification process.\n\nVerification code:\n${resetToken}\nPlease be aware that if you do not complete this process within 10 minute(s), the above verification code will become invalid.\n\nIf you were not expecting to receive this e-mail, the account may have been accessed by an unauthorized third-party.\n\n-------------------------\nSincerely,\n\nE-Commerce App,\n\nYou cannot reply to this e-mail address.`;
		await sendEmail({
			from: "E-app",
			to: checkEmail.email,
			subject: "Password Reset Token",
			text: resetMessage,
		});

		respond(res, STATUS.OK, "Reset token sent to your email");
	} catch (err) {
		await Account.findByIdAndUpdate(checkEmail._id, {
			resetPasswordToken: undefined,
			resetPasswordExpires: undefined,
		});

		console.error("Error details:", err);

		const errorMessage =
			err.code === "ECONNREFUSED"
				? "Could not connect to email server"
				: err.message || "Error sending reset email";

		return next(
			new appError(`Failed to send reset token`, STATUS.INTERNAL_SERVER_ERROR)
		);
	}
});

exports.resetpassword = catchAsync(async (req, res, next) => {
	const { email, code, newpassword, confirmpassword } = req.body;

	if (!email) {
		return next(
			new appError("Please provide an email address", STATUS.BAD_REQUEST)
		);
	}

	const checkEmail = await Account.findOne({ email });
	if (
		!checkEmail ||
		!checkEmail.resetPasswordTokenExp < Date.now() ||
		!checkEmail.resetPasswordToken ||
		newpassword !== confirmpassword
	) {
		return next(new appError("You don't have a code !!", STATUS.UNAUTHORIZED));
	}
	const hashedToken = crypto.createHash("sha256").update(code).digest("hex");
	const account = await Account.findOne({ resetPasswordToken: hashedToken });
	if (!account)
		return next(new appError("account not found", STATUS.UNAUTHORIZED));

	account.password = newpassword;
	account.resetPasswordToken = undefined;
	account.resetPasswordTokenExp = undefined;
	await account.save();

	const token = signToken({ id: account._id, role: account.role });
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	};

	res.cookie("jwt", token, cookieOptions);
	account.password = undefined;

	respond(res, STATUS.OK, "Password has been reset succesfully", {
		account,
		token,
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	console.log("--- PROTECT MIDDLEWARE START ---");
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		console.log("No token found. Access denied.");
		return next(
			new appError(
				"You are not logged in! Please log in to get access.",
				STATUS.UNAUTHORIZED
			)
		);
	}

	console.log("Token found. Verifying...");
	const decoded = await jwt.verify(token, process.env.JWT_SECRET);
	console.log("Token decoded. User ID:", decoded.id);

	const baseAccount = await Account.findById(decoded.id);
	if (!baseAccount) {
		console.log("No account found for this token. Access denied.");
		return next(
			new appError(
				"The user belonging to this token does no longer exist.",
				STATUS.UNAUTHORIZED
			)
		);
	}
	console.log("Base account found. Role:", baseAccount.role);

	let currentUserProfile;
	if (baseAccount.role === "Staff" || baseAccount.role === "Admin") {
		console.log("Searching for Staff profile...");
		currentUserProfile = await Staff.findOne({ account: baseAccount._id });
	} else if (baseAccount.role === "Customer") {
		console.log("Searching for User profile...");
		currentUserProfile = await User.findOne({ account: baseAccount._id });
	}

	if (!currentUserProfile) {
		console.log(
			"CRITICAL: No user/staff profile found for the account. Access denied."
		);
		return next(
			new appError(
				"The associated user/staff profile could not be found.",
				STATUS.UNAUTHORIZED
			)
		);
	}
	console.log("User/Staff profile found:", currentUserProfile._id);

	req.account = baseAccount;
	req.user = currentUserProfile;
	console.log("--- PROTECT MIDDLEWARE SUCCESS: Calling next() ---");
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

exports.getMe = (req, res, next) => {
	const safeAccount = req.account.toObject();
	delete safeAccount.password;

	respond(res, STATUS.OK, "Current session data retrieved", {
		account: safeAccount,
		profile: req.user,
	});
};
