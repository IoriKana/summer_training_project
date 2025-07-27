const User = require("../model/userModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "User creation failed",
      error: error.message,
    });
  }
};

// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    message: "Users fetched successfully",
    length: users.length,
    data: users,
  });
});

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: "fail", error: err.message });
  }
};
exports.deleteUser = catchAsync(async (req, res, next) => {
  const userExists = await User.findById(req.params.id);
  if (!userExists) {
    return next(new AppError("User not found", 404));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json();
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ user });
});
