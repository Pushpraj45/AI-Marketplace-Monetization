// Simple test script for Azure OpenAI
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create custom HTTPS agents with different SSL options to try
const httpsAgents = {
  default: new https.Agent({
    rejectUnauthorized: false, // Disable certificate validation (use with caution)
    secureProtocol: 'TLSv1_2_method' // Force TLSv1.2
  }),
  tlsv11: new https.Agent({
    rejectUnauthorized: false,
    secureProtocol: 'TLSv1_1_method' // Try TLSv1.1
  }),
  tlsv1: new https.Agent({
    rejectUnauthorized: false,
    secureProtocol: 'TLSv1_method' // Try TLSv1
  }),
  tls: new https.Agent({
    rejectUnauthorized: false,
    // No specific protocol, let Node.js negotiate
  })
};

// Updated Azure OpenAI credentials
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;

async function testAzureOpenAI() {
  console.log("Testing Azure OpenAI connection with multiple HTTPS agents...");
  
  // Try each HTTPS agent until one works
  for (const [name, agent] of Object.entries(httpsAgents)) {
    console.log(`\nTrying with ${name} TLS settings...`);
    
    try {
      // Create Azure OpenAI client with current HTTPS agent
      const client = new OpenAIClient(
        endpoint, 
        new AzureKeyCredential(apiKey),
        { httpClient: { httpAgent: agent } }
      );
      
      console.log("Client created successfully, attempting completion...");
      
      // Test message
      const messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello in one sentence." }
      ];
      
      // Try to get completion
      const response = await client.getChatCompletions(
        deploymentName,
        messages,
        {
          temperature: 0.7,
          maxTokens: 50
        }
      );
      
      console.log("SUCCESS! Response received with", name, "TLS settings:");
      console.log("Content:", response.choices[0].message.content);
      console.log("Usage:", response.usage);
      
      // Return the successful agent name
      return { success: true, agentName: name };
    } catch (error) {
      console.error(`ERROR with ${name} TLS settings:`, error.message);
      console.error('Error name:', error.name);
      console.error('Error stack:', error.stack);
    }
  }
  
  // If we get here, all agents failed
  console.error("All TLS configurations failed");
  return { success: false };
}

// Run the test
testAzureOpenAI()
  .then(result => {
    if (result.success) {
      console.log(`\n✅ TEST SUCCESSFUL with ${result.agentName} TLS settings! Update your code to use these settings.`);
      process.exit(0);
    } else {
      console.log("\n❌ TEST FAILED with all TLS settings.");
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Uncaught error:", err);
    process.exit(1);
  }); 