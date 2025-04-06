const express = require("express");
const router = express.Router();
const modelController = require("../controllers/modelController");
const aiController = require("../controllers/aiController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

// Test route - no auth required
router.get("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Model routes are working" });
});

// Test Azure OpenAI connection - no auth required for testing
router.get("/test-azure", aiController.testAzureOpenAI);

// Run standalone test script - no auth required
router.get("/test-tls", (req, res) => {
  // Import the test script
  const testPath = "../test-azure.js";
  const testModule = require(testPath);
  
  res.status(200).json({ 
    success: true, 
    message: "TLS test script started. Check server logs for results." 
  });
});

// Test Azure OpenAI deployments - no auth required for testing
router.get("/test-deployments", aiController.testDeployments);

// Direct test with hardcoded values - no auth required
router.get("/direct-test", aiController.directTest);

// Python-style test mimicking the example code - no auth required
router.get("/python-test", aiController.pythonStyleTest);

// Simple completion endpoint - no auth required for testing
router.post("/completion", aiController.getCompletion);

// Public routes - available to all users
router.get("/marketplace", modelController.getMarketplaceModels);
router.get("/marketplace/:id", modelController.getMarketplaceModelById);

// Model interaction
router.post("/generate", auth, aiController.generateCompletion);

// Developer routes - only for developers
router.get("/", auth, roleCheck(["developer"]), modelController.getDeveloperModels);
router.post("/", auth, roleCheck(["developer"]), modelController.createModel);
router.get("/:id", auth, roleCheck(["developer"]), modelController.getDeveloperModelById);
router.put("/:id", auth, roleCheck(["developer"]), modelController.updateModel);
router.delete("/:id", auth, roleCheck(["developer"]), modelController.deleteModel);

// Publishing routes
router.put("/:id/submit", auth, roleCheck(["developer"]), modelController.submitForPublishing);

module.exports = router; 