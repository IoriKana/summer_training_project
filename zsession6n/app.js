const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");
const authRouter = require("./routes/authRoutes");

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/product", productRoutes);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/review", reviewRouter);
app.use("/api/order", orderRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;

// MVC => model , view , controller
// view -> controller -> model -> DB

// error handling , authentication , authorization , token , hash password

// token => jwt => json web token
// header payload signature
