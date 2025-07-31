const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const {catchAsync} = require("../utils/catchAsync");
const Product = require("../models/productModel");
const ApiFilter = require("../utils/apiFliter")

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const filter = new ApiFilter(Product.find(), req.query).filter().sort().fields().pagination()
    
    const products = await filter.query;

    respond(res, STATUS.OK, "products:", products)
})

exports.createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await Product.create({ ...req.body, staff: req.user.id });
    respond(res, STATUS.CREATED, "Product created successfully", newProduct);
});

exports.GetProductById = catchAsync(async (req, res, next) => {
    const getProduct = await Product.findById(req.params.id);
    if (!getProduct) {
        return next(new AppError("Product not found ", STATUS.NOT_FOUND));
    }
    respond(res, STATUS.OK, "Product: ", getProduct);
})

exports.updateProduct = catchAsync(async (req, res, next) => {
    const updateProduct = await Product.findOneAndUpdate({ _id: req.params.id },req.body,{ new: true });
    respond(res, STATUS.OK, "Product has been updated ", updateProduct);
})


exports.deleteProduct = catchAsync(async (req, res, next) => {
    const deleteProduct = await Product.findOneAndDelete({ _id: req.params.id })
    respond(res, STATUS.NO_CONTENT, "Product has been deleted ", deleteProduct);
})



