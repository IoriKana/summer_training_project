const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const Order = require("../models/orderModel");

exports.getAllOrders = catchAsync(async (req, res, next) => {
	const getData = await Order.find();
	respond(res, STATUS.OK, "data : ", getData);
});

exports.createOrder = catchAsync(async (req, res, next) => {
	const { orderDate, totalCost, user, cartId } = req.body;
	if (!orderDate || !totalCost || !user || !cartId) {
		return next(new AppError("Missing required fields", STATUS.BAD_REQUEST));
	}
	const newOrder = await Order.create({
		orderDate,
		totalCost,
		user,
		cartId
	});

	respond(res, STATUS.CREATED, "Data: ", newOrder);
});

exports.getOrderById = catchAsync(async (req, res, next) => {
	const getOrder = await Order.findById(req.params.id);

	if (!getOrder) {
		return next(new AppError('No order found with that ID', STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "Data: ", getOrder);
});

exports.updateOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findByIdAndUpdate(req.params.id);

	if (!order) {
		return next(new AppError('No order found with that ID', STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "Success", order);
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
	const deletedOrder = await Order.findOneAndDelete(req.params.id);

	if (!deletedOrder) {
		return next(new AppError("Order not found", STATUS.NOT_FOUND));
	}
	respond(res, STATUS.OK, "Order has been deleted ", deletedOrder);
});
