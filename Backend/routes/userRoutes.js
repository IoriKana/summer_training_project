const express = require("express");
const {
	getAllUsers,
	getUserByID,
	updateUser,
	deleteUser,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.use(protect);


router.use(restrictTo("Admin"));
router.route("/").get(getAllUsers);

router.route("/:id")
	.get(getUserByID)
	.patch(updateUser)
	.delete(deleteUser);


module.exports = router;