const Product = require("../model/productModel");
const Review = require("../model/reviewModel");

exports.getAllReview = async (req, res) => {
  try {
    const newReview = await Review.find();
    res.status(200).json({
      message: "success",
      length: newReview.length,
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", error: error.message });
  }
};
exports.createReview = async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    const newReview = await Review.create(req.body);
    product.review.push(newReview);
    await product.save();
    res.status(201).json({
      message: "success",
      length: newReview.length,
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", error: error.message });
  }
};
