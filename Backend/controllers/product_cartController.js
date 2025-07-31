const STATUS = require("../modules/status.js").STATUS;
const respond = require("../modules/helperMethods.js").respond;

const Cart = require("../models/cartModel.js");
const Product = require("../models/productModel.js");
const ProductCart = require("../models/product_CartModel.js");

const { catchAsync } = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const mongoose = require('mongoose')


const checkProduct = async (productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError("Product not found", STATUS.NOT_FOUND);
    }
    if (typeof quantity === 'number' && quantity > 0 && product.stock < quantity) {
        throw new AppError("Requested quantity exceeds available stock", STATUS.BAD_REQUEST);
    }
    return product;
}


const checkOrCreateCart = async (userID) => {
    let cart = await Cart.findOne({ user: userID });
    if (!cart) {
        cart = await Cart.create({ user: userID });
    }
    return cart;
}


exports.addProductToCart = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    if (!productId) {
        return next(new AppError("ProductId is required", STATUS.BAD_REQUEST));
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new AppError("Invalid productId format", STATUS.BAD_REQUEST));
    }
    if (!quantity || quantity <= 0) {
        return next(new AppError("Quantity must be greater than zero", STATUS.BAD_REQUEST));
    }
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError("Product not found", STATUS.NOT_FOUND));
    }
    const cart = await checkOrCreateCart(req.user.id);
    let productInCart = await ProductCart.findOne({ cartId: cart._id, productId });
    let newQuantity = quantity;
    if (productInCart) {
        newQuantity = productInCart.quantity + quantity;
    }
    if (newQuantity > product.stock) {
        return next(new AppError("Requested quantity exceeds available stock", STATUS.BAD_REQUEST));
    }
    if (productInCart) {
        productInCart.quantity = newQuantity;
        await productInCart.save();
    } else {
        productInCart = await ProductCart.create({ cartId: cart._id, productId, quantity });
    }
    await productInCart.populate('productId');
    respond(res, STATUS.OK, "Product added to cart", productInCart);
});


exports.updateCartProductQuantity = catchAsync(async (req, res, next) => {
    const productId = req.params.id;
    const newQuantity = req.body.quantity;
    if (!productId) {   
        return next(new AppError("ProductId is required", STATUS.BAD_REQUEST));
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new AppError("Invalid productId format", STATUS.BAD_REQUEST));
    }
    if (!newQuantity || newQuantity <= 0) {
        return next(new AppError("Quantity must be a positive number.", STATUS.BAD_REQUEST));
    }
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError("Product not found", STATUS.NOT_FOUND));
    }
    if (newQuantity > product.stock) {
        return next(new AppError("Requested quantity exceeds available stock", STATUS.BAD_REQUEST));
    }
    const cart = await checkOrCreateCart(req.user.id);
    const productInCart = await ProductCart.findOne({ productId, cartId: cart._id });
    if (!productInCart) {
        return next(new AppError("Product not found in cart", STATUS.NOT_FOUND));
    }
    productInCart.quantity = newQuantity;
    console.log(`new quantity: ${newQuantity}`);
    console.log(`quantity: ${newQuantity}`);
    
    await productInCart.save();
    await productInCart.populate('productId');
    respond(res, STATUS.OK, "Product quantity updated", productInCart);
});


exports.removeProductFromCart = catchAsync(async (req, res, next) => {
    const productId = req.params.id;
    if (!productId) {
        return next(new AppError("ProductId is required", STATUS.BAD_REQUEST));
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new AppError("Invalid productId format", STATUS.BAD_REQUEST));
    }
    const cart = await checkOrCreateCart(req.user.id);
    const deletedItem = await ProductCart.findOneAndDelete({
        productId,
        cartId: cart._id
    });
    if (!deletedItem) {
        return next(new AppError("Product not in cart", STATUS.BAD_REQUEST));
    }
    respond(res, STATUS.OK, "Product removed from cart");
})

exports.clearCart = catchAsync(async (req, res, next) => {
    const cart = await checkOrCreateCart(req.user.id);
    await ProductCart.deleteMany({ cartId: cart._id });
    respond(res, STATUS.OK, "Cart cleared");
})