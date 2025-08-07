const Account = require("../models/accountModel");
const appError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { STATUS } = require("../modules/status");
const { respond, msToTime } = require("../modules/helperMethods");
const Staff = require("../models/staffModel");
const User = require("../models/userModel");
const countries = require("../utils/countries");
const { sendEmail } = require("../modules/senderModule");
const Ban = require("../models/banModel");
const crypto = require("crypto");
const { log } = require("console");

const signToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signUp = catchAsync(async (req, res, next) => {
	const { userName, email, password, phoneNumber, country, city, building } =
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
			city: city,
			building: building,
		},
	});

	const token = signToken({ id: newAccount._id, role: newAccount.role });

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
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
	const userban = await Ban.findOne({ userId: account._id });

	if (userban !== null) {
		const staffAccount = await Account.findById(userban.staffId);
		if (userban.banDuration === undefined || userban.banDuration > Date.now()) {
			return next(
				new appError(
					`You have been banned by ${
						staffAccount.userName
					}, time remaining ${msToTime(userban.banDuration - Date.now())},
					${userban.banReason}
					 Please contact us via our email: eapp2035@gmail.com`,
					STATUS.UNAUTHORIZED
				)
			);
		}
		if (userban.banDuration < Date.now()) {
			await Ban.findOneAndDelete({ userId: account._id });
		}
	}

	const token = signToken({ id: account._id, role: account.role });

	const cookieOptions = {
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	res.cookie("jwt", token, cookieOptions);

	account.password = undefined;

	respond(res, STATUS.OK, "Success", { account: account, token });
});

exports.logout = (req, res) => {
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 5 * 1000),
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
			resetPasswordTokenExp: Date.now() + 10 * 60 * 1000,
		});

		await sendEmail({
			from: "E-app",
			to: checkEmail.email,
			subject: "Password Reset Token",
			html: `
  <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #1e1e1e; color: #f5f5f5; border: 1px solid #333; border-radius: 12px; padding: 32px; box-shadow: 0 0 10px rgba(0,0,0,0.6);">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://icons.veryicon.com/png/o/miscellaneous/logo-design-of-lingzhuyun/icon-correct-24-1.png" width="60" height="60"/>
      <p>AuraCart</p>
    </div><hr>

    <h2 style="text-align: center; color: #ffffff; margin-top: 0;">Email Verification Code</h2>
    <p style="text-align: center; color: #cccccc; font-size: 15px; margin-bottom: 30px;">
      Please use the code below to verify your email address:
    </p>

    <p style="text-align: center; font-size: 36px; font-weight: bold; color: #ffffff; margin: 20px 0;">
      ${resetToken}
    </p>

    <p style="text-align: center; color: #aaaaaa; font-size: 13px;">
      This code is valid for 10 minutes. If you didn’t request this, please ignore this email.
    </p>
    <hr>
    <p style="text-align: center; font-size: 12px; color: #777;">
      Message by AuraCart
    </p>
  </div>
			`,
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
	const { code, newpassword, confirmpassword } = req.body;
	const email = req.params.email;

	if (!email) {
		return next(
			new appError("Please provide an email address", STATUS.BAD_REQUEST)
		);
	}

	const checkEmail = await Account.findOne({ email });
	if (!checkEmail) {
		return next(new appError("Email not found.", STATUS.NOT_FOUND));
	}

	if (!checkEmail.resetPasswordToken) {
		return next(
			new appError(
				"No reset token found. Please request a new code.",
				STATUS.UNAUTHORIZED
			)
		);
	}

	if (checkEmail.resetPasswordTokenExp < Date.now()) {
		return next(
			new appError(
				"Reset code has expired. Please request a new one.",
				STATUS.UNAUTHORIZED
			)
		);
	}

	if (newpassword !== confirmpassword) {
		return next(new appError("Passwords do not match.", STATUS.BAD_REQUEST));
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
		sameSite: "none",
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

	if (!currentUserProfile || baseAccount.isBanned) {
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

	respond(res, STATUS.OK, "Current session data retrieved", {
		account: safeAccount,
		profile: req.user,
	});
};
