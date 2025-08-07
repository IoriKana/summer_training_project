const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;

const Cart = require("../models/cartModel.js");
const ProductCart = require("../models/product_CartModel.js");
const Product = require("../models/productModel.js");

const { catchAsync } = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const Order = require("../models/orderModel.js");
const Coupon = require("../models/couponModel.js");
const { sendEmail } = require("../modules/senderModule.js");
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

const applyDiscount = (price, coupon) => {
	console.log("function called: ", price);

	if (coupon !== undefined) {
		console.log("coupon is defined ");
		if (!coupon) {
			return price;
		}
		const discount = coupon.discount || 0;
		if (
			coupon.timesUsed < coupon.maximumUse &&
			coupon.expirationDate >= Date.now()
		) {
			const newPrice = price - price * discount;
			console.log("new price: ", newPrice);
			return newPrice;
		}
	}
	console.log("coupon undefined");
	return price;
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
	const shippingPrice = 10;
	const subtotal = calculateSubCost(items);
	let TotalVat = subtotal * VAT;
	const couponText = req.body.couponText;
	const coupon = couponText ? await Coupon.findOne({ text: couponText }) : null;

	const discountedPrice = applyDiscount(subtotal, coupon);
	let totalPrice =
		discountedPrice + VAT * discountedPrice + service_fees + shippingPrice;

	console.log(totalPrice);

	const newOrder = await Order.create({
		totalCost: totalPrice,
		account: req.account._id,
		items: orderItems,
		address: req.user.address,
	});

	await adjustStock(items);
	await Cart.findByIdAndDelete(cart._id);

	await sendEmail({
		from: process.env.FROM,
		to: req.account.email,
		subject: "Order confirm",
		html: `
			<div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #1e1e1e; color: #f5f5f5; border: 1px solid #333; border-radius: 12px; padding: 32px; box-shadow: 0 0 10px rgba(0,0,0,0.6);">
  				<div style="text-align: center; margin-bottom: 20px;">
    				<img src="https://icons.veryicon.com/png/o/miscellaneous/logo-design-of-lingzhuyun/icon-correct-24-1.png" width="60" height="60"/>
					<p>AuraCart</p>
  				</div><hr>
				
  				<h2 style="text-align: center; color: #ffffff; margin-top: 0;">Thank you for your order!</h2>
  				<p style="text-align: center; color: #cccccc; font-size: 15px; margin-bottom: 30px;">
    				Hello ${req.account.userName}, Your order has been confirmed.
  				</p>
  
  				<table style="width: 100%; border-collapse: collapse;">
    				<thead>
      					<tr>
        					<th style="text-align: left; padding: 12px; border-bottom: 1px solid #444;">Product</th>
        					<th style="text-align: center; padding: 12px; border-bottom: 1px solid #444;">Quantity</th>
        					<th style="text-align: right; padding: 12px; border-bottom: 1px solid #444;">Price</th>
      					</tr>
    				</thead>
				
    				<tbody>
      					${orderItems
									.map((item) => {
										const product = items.find((i) =>
											i.productId._id.equals(item.productId)
										);
										const name = product?.productId?.name || "Unknown Product";
										return `
            			<tr>
              				<td style="padding: 12px; border-bottom: 1px solid #2c2c2c;">${name}</td>
              				<td style="text-align: center; padding: 12px; border-bottom: 1px solid #2c2c2c;">${
												item.quantity
											}</td>
              				<td style="text-align: right; padding: 12px; border-bottom: 1px solid #2c2c2c;">$${item.price.toFixed(
												2
											)}</td>
            			</tr>
          				`;
									})
									.join("")}
    				</tbody>
  				</table>
				<h5 style="text-align: left; margin-top: 10px; color: #ffffff;">Service fees: $${service_fees.toFixed(
					2
				)}</h5>
    			<h5 style="text-align: left; margin-top: -20px; color: #ffffff;">Shpping price : $${shippingPrice.toFixed(
						2
					)}</h5>
	<h5 style="text-align: left; margin-top: -20px; color: #ffffff;">VAT : $${TotalVat.toFixed(
		2
	)}</h5>
	
	<h5 style="text-align: left; margin-top: 10px; color: #ffffff;">Discount: $-${
		subtotal - discountedPrice.toFixed(2)
	}</h5>
    			<h3 style="text-align: left; margin-top: 30px; color: #ffffff;">Total: $${totalPrice.toFixed(
						2
					)}</h3>
				<hr>
  				<p style="text-align: center; font-size: 12px; color: #777;">
    				Message by AuraCart
  				</p>
			</div>
`,
	});
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
