const Account = require("../models/accountModel");
const appError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { STATUS } = require("../modules/status");
const { respond } = require("../modules/helperMethods");
const Staff = require("../models/staffModel");
const User = require("../models/userModel");
const countries = require("../utils/countries")
// طب ليه منعملش لدول محدد انا مش بنشحن لدول العالم :joy:
// what about africa only
// بس ممكن ناخد دول معينة  مش افريقيا دول عربية منها مصر ، 
// and america, they have a lot of money i want money
// :joyTrump:
// ماشي يا ترامب خلصانة
//بص رجعها وخليها ي
const signToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

// 😍
exports.signUp = catchAsync(async (req, res, next) => {
	const { userName, email, password, phoneNumber,country,City,Building } = req.body;
	
	if(!country in countries){
		return next(new AppError("Country or city not found  ",STATUS.BAD_REQUEST));
	}
// no this will work i think
// when we start order we can do
// const shippingPrice = countries[req.user.country]
// omar wael when he see the code:
// :notJoy:
// i will watch you write the code
//first we need the info is not default
// we can make it in the same line 
// gamedddddddddddddddddd :joy:

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
		address : {
			country : country,
			city:City,
			building : Building
		}
	});

	const token = signToken({ id: newAccount._id, role: newAccount.role });
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
	const { password: _, ...safeAccountData } = account.toObject();

	respond(res, STATUS.OK, "Success", { account: safeAccountData, token });
});

exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return next(
			new appError(
				"You are not logged in! Please log in to get access.",
				STATUS.UNAUTHORIZED
			)
		);
	}

	const decoded = await jwt.verify(token, process.env.JWT_SECRET);

	const baseAccount = await Account.findById(decoded.id);
	if (!baseAccount) {
		return next(
			new appError(
				"The user belonging to this token does no longer exist.",
				STATUS.UNAUTHORIZED
			)
		);
	}

    let currentUserProfile;
    if (baseAccount.role === 'Staff' || baseAccount.role === 'Admin') {
        currentUserProfile = await Staff.findOne({ account: baseAccount._id });
    } else if (baseAccount.role === 'Customer') {
        currentUserProfile = await User.findOne({ account: baseAccount._id });
    }

    if (!currentUserProfile) {
        return next(
			new appError(
				"The associated user/staff profile could not be found.",
				STATUS.UNAUTHORIZED
			)
		);
    }

    req.account = baseAccount;
    req.user = currentUserProfile; 
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