const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables - use path.resolve to ensure correct path
const result = dotenv.config({ path: path.resolve(__dirname, '.env') });
if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("Environment variables loaded successfully");
}

// Print key Azure OpenAI config values (safely)
console.log("AZURE CONFIG:", {
  endpointExists: !!process.env.AZURE_OPENAI_ENDPOINT,
  apiKeyExists: !!process.env.AZURE_OPENAI_API_KEY,
  deploymentExists: !!process.env.AZURE_DEPLOYMENT_NAME,
});

// Initialize Express app
const app = express();

// CORS configuration with more options
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Detailed request logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Headers:', JSON.stringify(req.headers));
  if (req.method !== 'GET') {
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});

// Import routes
const authRoutes = require("./backend/routes/authRoutes");
const userRoutes = require("./backend/routes/userRoutes");
const modelRoutes = require("./backend/routes/modelRoutes");
const chatRoutes = require("./backend/routes/chatRoutes");

console.log("Routes loaded:", 
  "authRoutes:", !!authRoutes, 
  "userRoutes:", !!userRoutes, 
  "modelRoutes:", !!modelRoutes,
  "chatRoutes:", !!chatRoutes
);

// Log available routes
app._router && app._router.stack && console.log("Middleware stack length:", app._router.stack.length);

// Route middleware
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/chat", chatRoutes);

// Print all registered routes for debugging
function printRoutes(routes, basePath = '') {
  console.log("\n=== REGISTERED ROUTES ===");
  routes.stack.forEach(route => {
    if (route.route) {
      const methods = Object.keys(route.route.methods).map(method => method.toUpperCase()).join('|');
      console.log(`${methods} ${basePath}${route.route.path}`);
    } else if (route.name === 'router' && route.handle.stack) {
      const routerPath = route.regexp.toString().replace('\\/?(?=\\/|$)', '').replace('?(?=\\/|$)', '').replace(/^\\/, '').replace(/\\\//g, '/');
      
      const newBasePath = basePath + (routerPath !== '/' ? routerPath : '');
      
      printRoutes(route.handle, newBasePath);
    }
  });
  console.log("========================\n");
}

// Print all routes
if (app._router) {
  printRoutes(app._router);
}

// Debug route to check if server is running
app.get("/debug", (req, res) => {
  const userControllerMethods = Object.keys(require("./backend/controllers/userController"));
  
  res.json({
    message: "Debug endpoint working",
    routes: {
      authRoutes: !!authRoutes,
      userRoutes: !!userRoutes,
      modelRoutes: !!modelRoutes
    },
    userControllerMethods,
    userPublishedModelsExists: userControllerMethods.includes("getPublishedModels")
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("MonetizeAI API is running");
});

// Direct test route for published models
app.get("/api/test/models/published", async (req, res) => {
  try {
    const userController = require("./backend/controllers/userController");
    // Mock the auth middleware by adding req.user
    req.user = { id: "test-user-id" };
    
    // Call the controller method directly
    await userController.getPublishedModels(req, res);
  } catch (error) {
    console.error("Direct test route error:", error);
    
    // Return dummy data if the DB query fails
    res.status(200).json({
      success: true,
      message: "Test endpoint - Returning dummy data due to error",
      count: 1,
      data: [
        {
          _id: "dummy-model-id",
          name: "Test Model",
          description: "This is a test model returned from the test endpoint",
          tags: ["test", "demo"],
          owner: {
            profile: {
              name: "Test Developer",
              organization: "Test Org"
            }
          },
          stats: {
            usageCount: 100
          },
          perTokenPricing: {
            enabled: false
          }
        }
      ]
    });
  }
});

// Azure OpenAI direct test with hardcoded values
app.get("/api/test/azure-direct", async (req, res) => {
  try {
    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    
    // Use hardcoded values as fallback
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://pragya-serviceai.openai.azure.com/";
    const apiKey = process.env.AZURE_OPENAI_API_KEY || "7GWeJIZan52TgyrQmihYmBakuOfSwzVfdqiEmCBdkandeuqIpcyDJQQJ99AKACYeBjFXJ3w3AAABACOGgy6w";
    const deploymentName = process.env.AZURE_DEPLOYMENT_NAME || "gpt-35-turbo";
    
    console.log("DIRECT TEST - Using values:", {
      endpoint: endpoint ? `${endpoint.substring(0, 15)}...` : "MISSING",
      apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : "MISSING",
      deploymentName,
    });
    
    // Create client manually
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
    
    // Test messages
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Hello, is this connection working?" }
    ];
    
    // Make request
    const result = await client.getChatCompletions(deploymentName, messages, {
      temperature: 0.7,
      maxTokens: 100
    });
    
    res.status(200).json({
      success: true,
      message: "Azure OpenAI direct test successful",
      response: {
        content: result.choices[0].message.content,
        role: result.choices[0].message.role,
        tokenUsage: result.usage
      }
    });
  } catch (error) {
    console.error("Azure OpenAI direct test error:", error);
    res.status(500).json({
      success: false,
      message: "Azure OpenAI direct test failed",
      error: error.message,
      stack: error.stack
    });
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.path}`);
  console.log('Request headers:', JSON.stringify(req.headers));
  
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    availableRoutes: app._router ? 'Check server logs for available routes' : 'No routes available',
    authHeaderPresent: !!req.headers.authorization,
    authTokenFormat: req.headers.authorization ? 
      (req.headers.authorization.startsWith('Bearer ') ? 'Valid Bearer format' : 'Invalid format') : 
      'No token'
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/monetizeai")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Server configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
