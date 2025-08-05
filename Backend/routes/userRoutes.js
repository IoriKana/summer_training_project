const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");

const {
	getAllUsers,
	getUserByID,
	updateUser,
	deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.use(protect);

router.use(restrictTo("Admin"));

router.get("/", getAllUsers);

router.route("/:id").get(getUserByID).patch(updateUser).delete(deleteUser);

module.exports = router;
