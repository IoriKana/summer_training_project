const express = require("express");
const {createReview,getReviewForProduct,getAllReview}= require("../controllers/user_ProductController");
const {protect,restrictTo}= require("../controllers/authController");

const router = express.Router();

router.post("/", protect,createReview);
router.get("/:id",getReviewForProduct);
router.get("/",protect,restrictTo("Admin","staff"),getAllReview);

module.exports = router;
