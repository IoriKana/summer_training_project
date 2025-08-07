const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const Order = require("../models/orderModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.getAllOrders = catchAsync(async (req, res, next) => {
	const allOrders = await Order.find();
	respond(res, STATUS.OK, "All orders retrieved.", allOrders);
});

exports.getOrderById = catchAsync(async (req, res, next) => {
	const order = await Order.findById(req.params.id).populate({
		path: "items.productId",
		select: "name image",
	});

	if (!order) {
		return next(new AppError("No order found with that ID", STATUS.NOT_FOUND));
	}

	const isOwner = order.account.toString() === req.account._id.toString();
	const isStaff = ["Staff", "Admin"].includes(req.account.role);

	if (!isOwner && !isStaff) {
		return next(
			new AppError(
				"You do not have permission to view this order.",
				STATUS.FORBIDDEN
			)
		);
	}

	respond(res, STATUS.OK, "Order data retrieved.", order);
});

exports.updateOrder = catchAsync(async (req, res, next) => {
	const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!updatedOrder) {
		return next(new AppError("No order found with that ID", STATUS.NOT_FOUND));
	}

	respond(res, STATUS.OK, "Order updated successfully.", updatedOrder);
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
	const deletedOrder = await Order.findByIdAndDelete(req.params.id);

	if (!deletedOrder) {
		return next(new AppError("Order not found", STATUS.NOT_FOUND));
	}

	respond(res, STATUS.NO_CONTENT, "Order has been deleted.");
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
	const userOrders = await Order.find({ account: req.account._id })
		.populate({
			path: "items.productId",
			select: "name image",
		})
		.sort("-orderDate");

	respond(res, STATUS.OK, "Your orders have been retrieved.", userOrders);
});
