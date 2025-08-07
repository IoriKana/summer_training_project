const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;

const Coupon = require("../models/couponModel.js");
const Accound = require("../models/accountModel.js");

const { catchAsync } = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");

exports.getAllCoupons = catchAsync(async (req, res, next) => {
	const coupons = await Coupon.find();
	respond(res, STATUS.OK, "coupons: ", coupons);
});

exports.getCouponById = catchAsync(async (req, res, next) => {
	const couponId = req.params.id;
	const coupon = await Coupon.findById(couponId);
	respond(res, STATUS.OK, "coupons: ", coupon);
});

exports.getCouponByText = catchAsync(async (req, res, next) => {
	const text = req.params.text;
	const coupon = await Coupon.findOne({ text: text });
	if (!coupon) {
		return next(new AppError("Coupon not found", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "coupons: ", coupon);
});

const toMilliseconds = (hrs, min, sec) =>
	(hrs * 60 * 60 + min * 60 + sec) * 1000;
exports.createCoupon = catchAsync(async (req, res, next) => {
	const staff = req.account._id;
	const { text, discount, minPrice, timesUsed, maximumUse } = req.body;
	let expirationDate = req.body.expirationDate;
	if (expirationDate) {
		if (expirationDate.endsWith("d")) {
			const days = parseInt(expirationDate.replace("d", ""));
			expirationDate = toMilliseconds(24 * days, 0, 0) + Date.now();
		} else if (expirationDate.endsWith("h")) {
			const hours = parseInt(expirationDate.replace("h", ""));
			expirationDate = toMilliseconds(hours, 0, 0) + Date.now();
		} else if (expirationDate.endsWith("m")) {
			const minutes = parseInt(expirationDate.replace("m", ""));
			expirationDate = toMilliseconds(0, minutes, 0) + Date.now();
		} else {
			return next(
				new AppError("banDuration is not in correct form", STATUS.BAD_REQUEST)
			);
		}
	}

	const coupon = await Coupon.create({
		text,
		discount,
		expirationDate,
		minPrice,
		maximumUse,
		timesUsed,
		account: staff,
	});
	respond(
		res,
		STATUS.CREATED,
		"coupon succssfully created \n coupon Info ",
		coupon
	);
});

exports.deleteCoupon = catchAsync(async (req, res, next) => {
	const couponId = req.body.couponId;
	if (!couponId) {
		next(new AppError("must enter the couponId ", STATUS.BAD_REQUEST));
	}
	const couponDeleted = await findByIdAndDelete(couponId);
	if (!couponDeleted) {
		next(new AppError("coupon not found", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.NO_CONTENT, "coupon successfully deleted");
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
	const Coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});

	if (!Coupon) {
		return next(new AppError("No coupon found with that ID", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "coupon updated", Coupon);
});
