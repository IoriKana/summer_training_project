const express = require("express");
const {
	signUp,
	login,
	protect,
	restrictTo,
	createStaff,
} = require("../controllers/authController");

const router = express.Router();

//User registration
router.post("/signup", signUp);
// User login
router.post("/login", login);
// Staff creation (admin only)
router.post("/staff", protect, restrictTo("Admin"), createStaff);

module.exports = router;
