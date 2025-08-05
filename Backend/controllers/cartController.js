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

// @maged
// @maged
// here is response when i confirm cart

/*
{
    "message": "Order created",
    "length": null,
    "data": {
        "shippingStatus": "Pending",
        "paymentStatus": "Pending",
        "orderDate": "2025-08-02T15:13:36.351Z",
        "totalCost": 28.240000000000002,
        "user": "688ceedf359788fcc9fd68f8",
        "items": [
            {
                "_id": "688cf4bd8a769140d4de8d73",
                "name": "potato",
                "price": 4,
                "stock": 8999,
                "staff": "688a727463d80d98beae758f",
                "category": "general",
                "__v": 0
            }
        ],
        "_id": "688e2b3fd93bd027b78197ce",
        "__v": 0
    }
}
*/

// i will try order with 2 items
//okay
// 5 min and i will be right back

// YES it work! below is with 2 items in order

/*
{
    "message": "Order created",
    "length": null,
    "data": {
        "shippingStatus": "Pending",
        "paymentStatus": "Pending",
        "orderDate": "2025-08-02T15:14:59.533Z",
        "totalCost": 8569.12,
        "user": "688ceedf359788fcc9fd68f8",
        "items": [
            {
                "_id": "688cf4bd8a769140d4de8d73",
                "name": "potato",
                "price": 4,
                "stock": 8995,
                "staff": "688a727463d80d98beae758f",
                "category": "general",
                "__v": 0
            },
            {
                "_id": "688cef49359788fcc9fd68fd",
                "name": "iphone 12",
                "price": 2500,
                "stock": 98,
                "staff": "688a727463d80d98beae758f",
                "category": "general",
                "__v": 0
            }
        ],
        "_id": "688e2b9febd5b8af4ab5baa1",
        "__v": 0
    }
}
*/

// wait there is one problem

// this doesnt show quantity

// because it takes objects from Product, and Product does not have quantity

// ok take your time
// the solution is to use productCart maybe?
//  "totalCost": 8569.12,

// now it only returns id?

/*
    "message": "Order created",
    "length": null,
    "data": {
        "shippingStatus": "Pending",
        "paymentStatus": "Pending",
        "orderDate": "2025-08-02T15:24:34.925Z",
        "totalCost": 5710,
        "user": "688ceedf359788fcc9fd68f8",
        "items": [
            "688cefbb359788fcc9fd6909"
        ],
        "_id": "688e2db5688d38a5420ef3d2",
        "__v": 0
    }
*/
