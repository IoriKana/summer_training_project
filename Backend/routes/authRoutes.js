const express = require("express");
const {
	signUp,
	login,
	protect,
	restrictTo,
	createStaff,
	forgotPassword,
	resetpassword,
	getMe,
	logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:email", resetpassword);

// Admin-only route to create staff
router.post("/create-staff", protect, restrictTo("Admin"), createStaff);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
