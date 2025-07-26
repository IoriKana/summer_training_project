const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  getMe,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../controllers/authController");

const userRouter = express.Router();
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", protect, restrictTo("admin"), createUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/getMe/:id", getMe);

module.exports = userRouter;
