// Import the Express framework
const express = require("express");

// Import controller functions from productController
const {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  validateProduct,
} = require("../controllers/productController");
const { protect, restrictTo } = require("../controllers/authController");

const Router = express.Router();

Router.get("/", getAllProduct);

// Router.use(protect);
// Router.use(restrictTo("admin", "customer"));
Router.post("/", validateProduct, createProduct);

Router.get("/:id", getProductById);

Router.patch("/:id", updateProduct);

Router.delete("/:id", deleteProduct);

module.exports = Router;
