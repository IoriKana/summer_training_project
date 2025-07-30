const express = require("express");
const ProductRouter = express.Router();
const {protect,restrictTo} = require("../controllers/authController");
const {getAllProducts,createProduct,deleteProduct,GetProductById,updateProduct}=require("../controllers/productController");
ProductRouter.use(protect);
ProductRouter.get("/",getAllProducts);
ProductRouter.get("/:id",GetProductById);
ProductRouter.use(restrictTo("Admin","Staff"));
ProductRouter.post("/",createProduct);
ProductRouter.patch("/:id",updateProduct);
ProductRouter.delete("/:id",deleteProduct);

module.exports= ProductRouter;