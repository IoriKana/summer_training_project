const Product = require("../models/productModel");
const UserProduct = require("../models/user_productModel"); // <-- Using your exact model name
const { catchAsync } = require("../utils/catchAsync");
const { respond } = require("../modules/helperMethods");
const STATUS = require("../modules/status").STATUS;
const AppError = require("../utils/appError");

// This function likely exists in your controller already
exports.getAllProducts = catchAsync(async (req, res, next) => {
	const products = await Product.find();
	respond(res, STATUS.OK, "Products retrieved.", products);
});

// --- THIS IS THE FUNCTION TO REPLACE/UPDATE ---
exports.GetProductById = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	// 1. Fetch the main product information
	const productInfo = await Product.findById(id);

	if (!productInfo) {
		return next(
			new AppError("No product found with that ID", STATUS.NOT_FOUND)
		);
	}

	// 2. Fetch the reviews for that product and populate the author's details
	const reviews = await UserProduct.find({ productId: id })
		.populate({
			path: "accountID", // This is the field in your user_productModel
			select: "userName profile_image_url", // The fields you want from the Account model
		})
		.sort({ date: -1 });

	// 3. Send both back in the format your frontend expects
	respond(res, STATUS.OK, "Product and reviews retrieved successfully", {
		ProductInfo: productInfo,
		Reviews: reviews,
	});
});
exports.createProduct = catchAsync(async (req, res, next) => {
	const newProduct = new Product({
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
		stock: req.body.stock,
		staff: req.user.id,
		category: req.body.category,
		image: req.cloudinary.secure_url,
		cloudinary_id: req.cloudinary.public_id,
	});
	await newProduct.save();

	respond(res, STATUS.CREATED, "Product created successfully", newProduct);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
	const updateProduct = await Product.findOneAndUpdate(
		{ _id: req.params.id },
		req.body,
		{ new: true }
	);
	respond(res, STATUS.OK, "Product has been updated ", updateProduct);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
	const deleteProduct = await Product.findOneAndDelete({ _id: req.params.id });
	respond(res, STATUS.NO_CONTENT, "Product has been deleted ", deleteProduct);
});
