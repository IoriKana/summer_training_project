const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const upload = require("../utils/upload");
const streamUpload = require("../utils/cloudinary");
const {
	getAllProducts,
	createProduct,
	deleteProduct,
	GetProductById,
	updateProduct,
} = require("../controllers/productController");

const ProductRouter = express.Router();

ProductRouter.get("/", getAllProducts);
ProductRouter.get("/:id", GetProductById);

ProductRouter.use(protect);
ProductRouter.use(restrictTo("Admin", "Staff"));

ProductRouter.post(
	"/",
	upload.single("image"),
	streamUpload("product-images"),
	createProduct
);
ProductRouter.patch("/:id", updateProduct);
ProductRouter.delete("/:id", deleteProduct);

module.exports = ProductRouter;
