const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");

const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");
const staffRoutes = require("./routes/staffRoutes");

dotenv.config({ path: "./.env" });
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/staff", staffRoutes);

module.exports = app;
