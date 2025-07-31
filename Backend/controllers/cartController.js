const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;

const Cart = require("../models/cartModel.js"); 
const ProductCart = require("../models/product_CartModel.js");
const Product = require("../models/productModel.js"); 

const { catchAsync } = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");

exports.getAllCarts = catchAsync(async (req, res, next) => {
    const carts = await Cart.find();
    respond(res, STATUS.OK, "Success", carts);
});

exports.getCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return respond(res, STATUS.NOT_FOUND, "Cart not found");
    }

    const items = await ProductCart.find({ cartId: cart._id }).populate("productId");


    let subtotal = 0;
    for (const item of items) {
        if (item.productId && typeof item.productId.price === 'number') {
            subtotal += item.quantity * item.productId.price;
        }
    }

    respond(res, STATUS.OK, "Success", {
        cart,
        items,
        subtotal
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

