const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

// Get all users - admin only
router.get("/", auth, roleCheck(["admin"]), userController.getAllUsers);

// Get published models for users
router.get("/models/published", auth, userController.getPublishedModels);

// Get user by ID - own profile or admin
router.get("/:id", auth, userController.getUserById);

// Update user profile - own profile only
router.put("/:id", auth, userController.updateUserProfile);

// Delete user - own account or admin
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
