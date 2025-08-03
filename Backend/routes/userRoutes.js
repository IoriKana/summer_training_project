const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const upload = require("../utils/upload");
const streamUpload = require("../utils/cloudinary");
const {
	getAllUsers,
	getUserByID,
	updateUser,
	deleteUser,
	updateProfilePicture,
	getProfile,
} = require("../controllers/userController");

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);

router.put(
	"/profile/image",
	upload.single("image"),
	streamUpload("user-profile-pics"),
	updateProfilePicture
);

router.use(restrictTo("Admin"));

router.get("/", getAllUsers);

router.route("/:id").get(getUserByID).patch(updateUser).delete(deleteUser);

module.exports = router;
