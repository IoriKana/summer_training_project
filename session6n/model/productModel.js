const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product must have a title"],
    unique: true,
  },
  description: String,
  price: Number,
  rating: {
    type: Number,
    default: 1.0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  review: Array,
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
