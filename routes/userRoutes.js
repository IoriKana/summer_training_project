const express = require("express");
const {
	getAllUsers,
	createUser,
	getUserByID,
	updateUser,
	deleteUser,
} = require("../controllers/userController");

const Router = express.Router();

Router.get("/", getAllUsers);
Router.post("/create", createUser);
Router.get("/get/:id", getUserByID);
Router.patch("/update/:id", updateUser);
Router.delete("/delete/:id", deleteUser);

module.exports = Router;
