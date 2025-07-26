const express = require("express");

const { getAllOrder, createOrder } = require("../controllers/orderController");
const { protect } = require("../controllers/authController");

const orderRouter = express.Router();

orderRouter.get("/", getAllOrder);
orderRouter.post("/createOrder", protect, createOrder);

module.exports = orderRouter;
