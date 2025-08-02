const express = require("express");
const {
	getAllUsers,
	getUserByID,
	updateUser,
	deleteUser,
	setProfilePic,
	getProfile
} = require("../controllers/userController");
const upload = require('../utils/multer.js')
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile)

router.put('/profile/image',upload.single('image') , setProfilePic)


router.use(restrictTo("Admin"));
router.route("/").get(getAllUsers);
router.route("/:id")
	.get(getUserByID)
	.patch(updateUser)
	.delete(deleteUser);


module.exports = router;