const express = require("express");
// FIXED: Removed 'createUser' as it no longer exists in the controller.
const {
	getAllUsers,
	getUserByID,
	updateUser,
	deleteUser,
} = require("../controllers/userController");
// NECESSARY: Imported auth controllers for security.
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router(); // Using lowercase 'router' is a standard convention.

// --- SECURITY BARRIER ---
// All routes defined below this line will now require the user to be logged in.
router.use(protect);

// --- AUTHORIZATION BARRIER ---
// All routes below this line will now require the logged-in user to have the "Admin" role.
router.use(restrictTo("Admin"));

// FIXED: Routes are now structured in a standard RESTful way.

// Route for getting all users.
// GET /api/v1/users/
router.route("/").get(getAllUsers);

// Routes for interacting with a single user by their ID.
// GET, PATCH, DELETE /api/v1/users/:id
router.route("/:id")
	.get(getUserByID)
	.patch(updateUser)
	.delete(deleteUser);

// The old /create, /get/:id, /update/:id routes have been removed or consolidated
// into the RESTful structure above.

module.exports = router;