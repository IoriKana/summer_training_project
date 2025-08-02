const userProduct = require("../models/user_productModel");
const {catchAsync} = require("../utils/catchAsync");
const {respond} = require("../modules/helperMethods");
const STATUS = require("../modules/status").STATUS;
const Order = require("../models/orderModel");
const AppError = require("../utils/appError");

// Helper function to check if product was ordered
const isOrdered = async (userId, productId) => {
    const user = await Order.find({
        user: userId,
        'items.productId': productId//هنا انا معرفتش ازاي عملها مش مقتنع بيها
    });
    return user.length > 0;
    //ماهو بيبعت الايدي
};

exports.createReview = catchAsync(async (req, res, next) => {
    if (!req.body.productId || !req.body.review || !req.body.stars) {
        return next(new AppError("Missing required fields", 400));
    }

    
    const hasOrdered = await isOrdered(req.user.id, req.body.productId);
    if (!hasOrdered) {
        return next(new AppError("You can only review products you have ordered", 403));
    }
    const newReview = await userProduct.create({
        userID: req.user.id,
        productId: req.body.productId,
        review: req.body.review,
        stars: req.body.stars
    });

    respond(res, STATUS.CREATED, "Review created successfully", newReview);
});

exports.getReviewForProduct = catchAsync(async (req, res, next) => {
    const reviews = await userProduct.find({productId: req.params.id})
        .populate("productId")
        .populate("userID", "name"); 

    if (!reviews) {
        return next(new AppError("No reviews found for this product", 404));
    }

    respond(res, STATUS.OK, "Reviews retrieved successfully", reviews);
});

exports.getAllReview = catchAsync(async (req, res, next) => {
    const reviews = await userProduct.find()
        .populate("productId")
        .populate("userID", "name");

    respond(res, STATUS.OK, "All reviews retrieved successfully", reviews);
});



