const express = require("express");
const {
	getAllAccounts,
	getAccountByID,
	createAccount,
	login,
} = require("../controllers/accountController");

const Router = express.Router();

Router.get("/get", getAllAccounts);
Router.get("/get/:id", getAccountByID);
Router.post("/create", createAccount);
Router.post("/login", login);

module.exports = Router;
