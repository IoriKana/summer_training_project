const express = require("express");
const {
	signUp,
	login,
	protect,
	restrictTo,
	createStaff,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/staff", protect, restrictTo("Admin"), createStaff);

module.exports = router;
