// Simple test script for Azure OpenAI
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const https = require('https');
const axios = require('axios');
require('dotenv').config();

// Azure OpenAI credentials from environment variables
const endpoint = process.env.AZURE_OPENAI_ENDPOINT_ALTERNATIVE || process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY_ALTERNATIVE || process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_DEPLOYMENT_NAME_ALTERNATIVE || process.env.AZURE_DEPLOYMENT_NAME;

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
  }),
  // Microsoft recommended approach
  azure: new https.Agent({
    rejectUnauthorized: true, // Enable certificate validation
    secureProtocol: 'TLSv1_2_method', // Force TLSv1.2
    secureOptions: require('constants').SSL_OP_NO_TLSv1 | require('constants').SSL_OP_NO_TLSv1_1,
    ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256'
  })
};

async function testAzureOpenAI() {
  console.log("Testing Azure OpenAI connection with multiple HTTPS agents...");
  
  // Try each HTTPS agent until one works
  for (const [name, agent] of Object.entries(httpsAgents)) {
    console.log(`\nTrying with ${name} TLS settings...`);
    
    try {
      // Configure axios with current HTTPS agent
      const axiosInstance = axios.create({
        httpsAgent: agent,
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        }
      });
      
      // Try direct API call with axios
      console.log("Attempting direct API call with axios...");
      const url = `${endpoint}openai/deployments/${deploymentName}/chat/completions?api-version=2023-12-01-preview`;
      
      // Log request details for debugging
      console.log(`API URL: ${url}`);
      
      const payload = {
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say hello in one sentence." }
        ],
        temperature: 0.7,
        max_tokens: 50
      };
      
      const response = await axiosInstance.post(url, payload);
      
      console.log("SUCCESS! Response received with", name, "TLS settings:");
      console.log("Content:", response.data.choices[0].message.content);
      console.log("Usage:", response.data.usage);
      
      // Return the successful agent name
      return { success: true, agentName: name };
    } catch (error) {
      console.error(`ERROR with ${name} TLS settings:`, error.message);
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Data:`, JSON.stringify(error.response.data));
      }
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