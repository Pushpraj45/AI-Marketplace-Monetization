const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

// Test route
router.get("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Analytics routes are working" });
});

// Developer dashboard summary
router.get("/dashboard", auth, roleCheck(["developer"]), analyticsController.getDeveloperDashboardSummary);

// Model detailed analytics
router.get("/models/:id", auth, roleCheck(["developer"]), analyticsController.getModelDetailedAnalytics);

module.exports = router; 