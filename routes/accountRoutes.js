const express = require("express");
const { getAllAccounts, createAccount, deleteAccount, getById } = require("../controllers/accountController");
const { restrictTo, protect } = require("../controllers/authController");


const AccountRouter = express.Router();
AccountRouter.use(protect)
AccountRouter.use(restrictTo("Admin","Staff"));
AccountRouter.get("/",getAllAccounts);
AccountRouter.post("/",createAccount);
AccountRouter.get("/:email",getById);
AccountRouter.delete("/:email",deleteAccount);

