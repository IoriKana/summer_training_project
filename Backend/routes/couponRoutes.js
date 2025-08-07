const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
	createCoupon,
	getCouponByText,
	getAllCoupons,
} = require("../controllers/couponController");
const router = express.Router();
router.use(protect);
router.get("/:text", getCouponByText);
router.use(restrictTo("Admin", "Staff"));
router.post("/", createCoupon);
router.get("/", getAllCoupons);
module.exports = router;
