const Order = require("../model/orderModel");

exports.getAllOrder = async (req, res) => {
  try {
    const newOrder = await Order.find().populate("userId");
    res.status(200).json({
      message: "success",
      length: newOrder.length,
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const newOrder = await Order.create({ ...req.body, userId: req.user._id });
    res.status(200).json({
      message: "success",
      length: newOrder.length,
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", error: error.message });
  }
};
