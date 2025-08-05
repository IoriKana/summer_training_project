const express = require("express");
const {
	protect,
	restrictTo,
	createStaff,
} = require("../controllers/authController");
const { banUser, unbanAccount } = require("../controllers/staffController");

const router = express.Router();

router.post("/create", protect, restrictTo("Admin"), createStaff);
router.post("/ban", protect, restrictTo("Admin", "Staff"), banUser);
router.post("/unban", protect, restrictTo("Admin", "Staff"), unbanAccount);
module.exports = router;
