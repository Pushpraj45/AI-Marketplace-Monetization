// Test script for Azure OpenAI credentials
const { OpenAIClient } = require("@azure/openai");
const https = require('https');
const dotenv = require('dotenv');

// Load the environment variables
const result = dotenv.config();
console.log("Dotenv result:", result.error ? "Error: " + result.error.message : "Loaded successfully");

// Create a HTTPS agent with relaxed SSL validation
const agent = new https.Agent({
  rejectUnauthorized: false
});

// Azure OpenAI credentials - use env vars
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;

// Log what we're using
console.log("TEST CONFIGURATION:");
console.log("- ENDPOINT:", endpoint ? `${endpoint.substring(0, 20)}...` : "MISSING");
console.log("- API KEY:", apiKey ? `${apiKey.substring(0, 5)}...` : "MISSING");
console.log("- DEPLOYMENT:", deploymentName || "MISSING");
console.log("- ENV VARS:", {
  AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT ? "SET" : "NOT SET",
  AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY ? "SET" : "NOT SET", 
  AZURE_DEPLOYMENT_NAME: process.env.AZURE_DEPLOYMENT_NAME ? "SET" : "NOT SET",
  AZURE_OPENAI_KEY: process.env.AZURE_OPENAI_KEY ? "SET" : "NOT SET",
});

// Set vars directly in current process environment if missing
if (!process.env.AZURE_OPENAI_ENDPOINT && endpoint) {
  console.log("Setting AZURE_OPENAI_ENDPOINT in process.env");
  process.env.AZURE_OPENAI_ENDPOINT = endpoint;
}
if (!process.env.AZURE_OPENAI_API_KEY && apiKey) {
  console.log("Setting AZURE_OPENAI_API_KEY in process.env");
  process.env.AZURE_OPENAI_API_KEY = apiKey;
}
if (!process.env.AZURE_DEPLOYMENT_NAME && deploymentName) {
  console.log("Setting AZURE_DEPLOYMENT_NAME in process.env");
  process.env.AZURE_DEPLOYMENT_NAME = deploymentName; 
}
// Also set AZURE_OPENAI_KEY as this might be what it's looking for
if (!process.env.AZURE_OPENAI_KEY) {
  console.log("Setting AZURE_OPENAI_KEY in process.env");
  process.env.AZURE_OPENAI_KEY = apiKey;
}

async function testAzureOpenAI() {
  console.log("\nTesting Azure OpenAI connection...");
  
  try {
    console.log("Creating Azure OpenAI client...");
    
    // Create Azure OpenAI client using the SDK correctly
    // Note: No AzureKeyCredential in this version
    const client = new OpenAIClient(endpoint, apiKey);
    console.log("Client created successfully");
    
    // Test message
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Say hello in one sentence." }
    ];
    
    console.log(`Attempting chat completion with deployment: ${deploymentName}`);
    
    // Try to get completion
    const response = await client.getChatCompletions(
      deploymentName,
      messages,
      {
        temperature: 0.7,
        maxTokens: 50
      }
    );
    
    console.log("SUCCESS! Response received:");
    console.log("Content:", response.choices[0].message.content);
    console.log("Usage:", response.usage);
    
    return true;
  } catch (error) {
    console.error("ERROR:", error.message);
    console.error("Error name:", error.name);
    console.error("Error constructor:", error.constructor.name);
    console.error("Error stack:", error.stack);
    return false;
  }
}

// Run the test
testAzureOpenAI()
  .then(success => {
    if (success) {
      console.log("\n✅ TEST SUCCESSFUL! The credentials are working.");
    } else {
      console.log("\n❌ TEST FAILED. Please check your Azure OpenAI credentials.");
    }
  })
  .catch(err => {
    console.error("Uncaught error:", err);
  }); 