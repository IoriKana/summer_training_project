const User = require("../model/userModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, username, password, phone, age, gender } =
    req.body;
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    username,
    password,
    phone,
    age,
    gender,
  });
  const token = signToken({ id: newUser._id, role: newUser.role });
  res.status(201).json({
    message: "success",
    data: newUser,
    token,
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }
  const userExists = await User.findOne({ email }, "+password");
  if (!userExists || !(await userExists.correctPassword(password))) {
    return next(new AppError("incorrcet email or password", 401));
  }
  const token = signToken({ id: userExists._id, role: userExists.role });
  res.status(200).json({
    message: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(
      new AppError("You are not logged in! please log in to get access", 401)
    );
  }
  const token = req.headers.authorization.split(" ")[1]; // Bearer token => [Bearer , token]
  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  const userExists = await User.findById(decode.id);
  if (!userExists) {
    return next(new AppError("User no longer exists", 404));
  }
  req.user = userExists;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
