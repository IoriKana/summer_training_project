const express = require("express");
const upload = require("../utils/upload");
const streamUpload = require("../utils/cloudinary");
const {
	getAllAccounts,
	createAccount,
	deleteAccount,
	getById,
	updateProfilePicture,
	updateMyAccount,
} = require("../controllers/accountController");
const { restrictTo, protect } = require("../controllers/authController");

const AccountRouter = express.Router();

AccountRouter.use(protect);
AccountRouter.put(
	"/profile/image",
	upload.single("image"),
	streamUpload("user-profile-pics"),
	updateProfilePicture
);
AccountRouter.patch("/me", updateMyAccount);

AccountRouter.use(restrictTo("Admin", "Staff"));
AccountRouter.get("/", getAllAccounts);
AccountRouter.post("/", createAccount);
AccountRouter.get("/:id", getById);
AccountRouter.delete("/:id", deleteAccount);

module.exports = AccountRouter;
