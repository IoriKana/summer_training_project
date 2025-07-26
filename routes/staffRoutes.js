const express = require("express");
const {
	protect,
	restrictTo,
	createStaff,
} = require("../controllers/accountController");

const router = express.Router();

// Only the main admin can create staff accounts
router.post("/create", protect, restrictTo("Admin"), createStaff);

module.exports = router;
