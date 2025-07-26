const Product = require("../model/productModel");

exports.getAllProduct = async (req, res) => {
  try {
    const productList = await Product.find();
    res.status(200).json({
      message: "success",
      length: productList.length,
      data: productList,
    });
  } catch (err) {
    res.status(500).json({ message: "fail", error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "the product returned", data: product });
  } catch (err) {
    res.status(500).json({ message: "fail", error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ message: "new product created", data: newProduct });
  } catch (err) {
    res.status(500).json({ message: "fail", error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found to update" });
    }
    res.status(200).json({
      message: "product updated successfully",
      data: updateProduct,
    });
  } catch (err) {
    res.status(500).json({ message: "fail", error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found to delete" });
    }
    res.status(204).json();
  } catch (err) {
    res.status(500).json({ message: "fail", error: err.message });
  }
};

exports.validateProduct = (req, res, next) => {
  const { title, price } = req.body;
  if (!title || !price) {
    return res
      .status(400)
      .json({ message: "Missing required fields: title and price" });
  }
  next();
};
