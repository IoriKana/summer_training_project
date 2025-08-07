const express = require("express");
const { protect } = require("../controllers/authController");
const {
	createReview,
	getReviewForProduct,
	checkIfUserCanReview,
} = require("../controllers/user_ProductController");

const router = express.Router();

router.route("/:id").get(getReviewForProduct);

router.use(protect);

router.route("/").post(createReview);
router.route("/check/:productId").get(checkIfUserCanReview);

module.exports = router;
