const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/tokenController");
const auth = require("../middleware/auth");

// All routes are protected
router.use(auth);

// Get user token balance
router.get("/", tokenController.getUserTokens);

// Get token usage history
router.get("/history", tokenController.getTokenHistory);

// Get model interactions
router.get("/models", tokenController.getModelInteractions);

// Get dashboard analytics
router.get("/dashboard", tokenController.getDashboardAnalytics);

// Deduct tokens for model usage
router.post("/deduct", tokenController.deductTokens);

// Add tokens to user (admin only or self)
router.post("/add", tokenController.addTokens);

module.exports = router; 