const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");

const userRoutes = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const staffRoutes = require("./routes/staffRoutes");
const accountRoutes = require("./routes/accountRoutes");

dotenv.config({ path: "./.env" });
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/staff", staffRoutes);
app.use("/api/accounts", accountRoutes);

module.exports = app;
