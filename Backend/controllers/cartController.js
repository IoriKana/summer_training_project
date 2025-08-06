const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;

const Cart = require("../models/cartModel.js");
const ProductCart = require("../models/product_CartModel.js");
const Product = require("../models/productModel.js");

const { catchAsync } = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const Order = require("../models/orderModel.js");
const countries = require("../utils/countries.js");

exports.getAllCarts = catchAsync(async (req, res, next) => {
	const carts = await Cart.find();
	respond(res, STATUS.OK, "Success", carts);
});

const calculateSubCost = (items) => {
	let subtotal = 0;
	for (const item of items) {
		if (item.productId && typeof item.productId.price === "number") {
			subtotal += item.quantity * item.productId.price;
		}
	}
	return subtotal;
};

const adjustStock = async (items) => {
	for (const item of items) {
		const product = await Product.findById(
			item.productId._id || item.productId
		);
		if (product) {
			product.stock -= item.quantity;
			if (product.stock < 0) product.stock = 0;
			await product.save();
		}
	}
};

exports.CartConfirm = catchAsync(async (req, res, next) => {
	const cart = await Cart.findOne({ user: req.user.id });
	if (!cart) {
		return next(new AppError("Cart not found", 404));
	}

	const items = await ProductCart.find({ cartId: cart._id }).populate(
		"productId"
	);
	const orderItems = items.map((item) => ({
		productId: item.productId._id,
		quantity: item.quantity,
		price: item.productId.price * item.quantity,
	}));
	const VAT = 0.14;
	const service_fees = 10;
	const shippingPrice = countries[req.user.address.country] || 100;
	const subtotal = calculateSubCost(items);
	const totalPrice = VAT * subtotal + subtotal + service_fees + shippingPrice;

	const newOrder = await Order.create({
		totalCost: totalPrice,
		user: req.user.id,
		items: orderItems,
		address: req.user.address,
	});
	await adjustStock(items);

	await Cart.findByIdAndDelete(cart._id);

	respond(res, STATUS.OK, "Order created", newOrder);
});

exports.getCart = catchAsync(async (req, res, next) => {
	const cart = await Cart.findOne({ user: req.user._id });
	if (!cart) {
		return respond(res, STATUS.NOT_FOUND, "Cart not found");
	}

	const items = await ProductCart.find({ cartId: cart._id }).populate(
		"productId"
	);

	const subtotal = calculateSubCost(items);

	respond(res, STATUS.OK, "Success", {
		cart,
		items,
		subtotal,
	});
});

exports.createCart = catchAsync(async (req, res, next) => {
	const existingCart = await Cart.findOne({ user: req.user._id });
	if (existingCart) {
		return respond(res, STATUS.OK, "Cart already exists", existingCart);
	}
	const newCart = await Cart.create({ user: req.user._id });
	respond(res, STATUS.CREATED, "Cart created", newCart);
});

exports.deleteCart = catchAsync(async (req, res, next) => {
	const cart = await Cart.findOneAndDelete({ user: req.user._id });

	if (!cart) {
		return respond(res, STATUS.NOT_FOUND, "Cart not found");
	}

	await ProductCart.deleteMany({ cart: cart._id });
	respond(res, STATUS.NO_CONTENT, "Cart and associated items deleted");
});
