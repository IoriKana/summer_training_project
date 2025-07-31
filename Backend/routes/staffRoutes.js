const express = require("express");
const {
	protect,
	restrictTo,
	createStaff,
} = require("../controllers/authController");

const router = express.Router();

router.post("/create", protect, restrictTo("Admin"), createStaff);

module.exports = router;
