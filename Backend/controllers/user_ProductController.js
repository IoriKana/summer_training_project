const Review = require("../models/user_productModel"); // Use the correct model
const { catchAsync } = require("../utils/catchAsync");
const { respond } = require("../modules/helperMethods");
const STATUS = require("../modules/status").STATUS;
const Order = require("../models/orderModel");
const AppError = require("../utils/appError");
const hasUserPurchasedProduct = async (accountId, productId) => {
	console.log("---");
	console.log("[CHECK 2] Now inside the 'hasUserPurchasedProduct' function.");
	console.log(
		`- Searching for Account ID: ${accountId} (Type: ${typeof accountId})`
	);
	console.log(
		`- Searching for Product ID: ${productId} (Type: ${typeof productId})`
	);
	console.log("---");

	try {
		const order = await Order.findOne({
			account: accountId,
			"items.productId": productId,
		});

		console.log("[CHECK 3] The result of the Order.findOne query is:", order);
		console.log("---");

		return !!order;
	} catch (e) {
		console.error("[ERROR] The Order.findOne query failed:", e);
		return false;
	}
};

exports.checkIfUserCanReview = catchAsync(async (req, res, next) => {
	const { productId } = req.params;
	const accountId = req.account._id;
	const hasPurchased = await hasUserPurchasedProduct(accountId, productId);

	if (!hasPurchased) {
		return respond(res, STATUS.OK, "User has not purchased this product.", {
			canReview: false,
		});
	}

	const existingReview = await Review.findOne({
		accountID: accountId,
		productId: productId,
	});

	if (existingReview) {
		return respond(res, STATUS.OK, "User has already reviewed this product.", {
			canReview: false,
		});
	}

	respond(res, STATUS.OK, "User is eligible to review this product.", {
		canReview: true,
	});
});

exports.createReview = catchAsync(async (req, res, next) => {
	const { productId, review, stars } = req.body;
	const accountId = req.account._id;

	if (!productId || !review || !stars) {
		return next(new AppError("Missing required fields", STATUS.BAD_REQUEST));
	}

	const hasPurchased = await hasUserPurchasedProduct(accountId, productId);
	if (!hasPurchased) {
		return next(
			new AppError(
				"You can only review products you have purchased.",
				STATUS.FORBIDDEN
			)
		);
	}

	const newReview = await Review.create({
		accountID: accountId,
		productId: productId,
		review: review,
		stars: stars,
	});

	respond(res, STATUS.CREATED, "Review created successfully", newReview);
});

exports.getReviewForProduct = catchAsync(async (req, res, next) => {
	const reviews = await Review.find({ productId: req.params.id }).populate({
		path: "accountID",
		select: "userName profile_image_url",
	});

	if (!reviews) {
		return next(new AppError("No reviews found for this product", 404));
	}

	respond(res, STATUS.OK, "Reviews retrieved successfully", reviews);
});
