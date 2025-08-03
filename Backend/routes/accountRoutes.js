const express = require("express");
const {
	getAllAccounts,
	createAccount,
	deleteAccount,
	getByEmail: getByEmail,
} = require("../controllers/accountController");
const { restrictTo, protect } = require("../controllers/authController");

const AccountRouter = express.Router();

AccountRouter.use(protect);
AccountRouter.use(restrictTo("Admin", "Staff"));

AccountRouter.get("/", getAllAccounts);
AccountRouter.post("/", createAccount);
AccountRouter.get("/:email", getByEmail);
AccountRouter.delete("/:email", deleteAccount);

module.exports = AccountRouter;