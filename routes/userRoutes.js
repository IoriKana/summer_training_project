const express = require("express");
const {
	getAllUser,
	createUser,
	getUserById,
	updateUser,
	deleteUser,
	validateUser,
	checkId,
} = require("../controllers/userController");

const Router = express.Router();

Router.get("/", getAllUser);
Router.post("/", validateUser, createUser);
Router.get("/:id", checkId, getUserById);
Router.patch("/:id", checkId, updateUser);
Router.delete("/:id", checkId, deleteUser);

module.exports = Router;
