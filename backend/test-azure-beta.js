// Test script for Azure OpenAI with beta SDK
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const dotenv = require('dotenv');

// Load the environment variables
dotenv.config({ path: '../.env' });

// Azure OpenAI credentials
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;

console.log("TEST CONFIGURATION:");
console.log("- ENDPOINT:", endpoint ? `${endpoint.substring(0, 20)}...` : "MISSING");
console.log("- API KEY:", apiKey ? `${apiKey.substring(0, 5)}...` : "MISSING");
console.log("- DEPLOYMENT:", deploymentName || "MISSING");

async function testAzureOpenAI() {
  console.log("\nTesting Azure OpenAI connection...");
  
  try {
    console.log("Creating Azure OpenAI client...");
    
    // Create client with AzureKeyCredential
    const credential = new AzureKeyCredential(apiKey);
    const client = new OpenAIClient(endpoint, credential);
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