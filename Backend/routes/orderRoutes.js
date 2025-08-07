const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
	getAllOrders,
	getOrderById,
	updateOrder,
	deleteOrder,
	getMyOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.use(protect);

router.route("/").get(getMyOrders);
router.route("/:id").get(getOrderById);

router.use(restrictTo("Admin", "Staff"));

router.route("/all").get(getAllOrders);

router.route("/admin/:id").patch(updateOrder).delete(deleteOrder);

module.exports = router;
