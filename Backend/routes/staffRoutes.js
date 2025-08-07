const express = require("express");
const {
	protect,
	restrictTo,
	createStaff,
} = require("../controllers/authController");
const {
	banUser,
	unbanAccount,
	resetAccountPassword,
} = require("../controllers/staffController");

const router = express.Router();

router.post("/create", protect, restrictTo("Admin"), createStaff);
router.post("/ban", protect, restrictTo("Admin", "Staff"), banUser);
router.post("/unban", protect, restrictTo("Admin", "Staff"), unbanAccount);
router.post(
	"/resetpassword",
	protect,
	restrictTo("Admin"),
	resetAccountPassword
);
module.exports = router;
