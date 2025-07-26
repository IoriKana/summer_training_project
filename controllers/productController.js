const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");

// exports.getAllProducts = catchAsync( async (req, res, next) => {
//     const Products = await Product.find().populate("StaffId");
// })