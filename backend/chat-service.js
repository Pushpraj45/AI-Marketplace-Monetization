// Azure OpenAI Chat Service
require('dotenv').config();
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const https = require("https");

// Set up Azure OpenAI credentials
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;

// Create a secure HTTPS agent for Azure
const azureHttpsAgent = new https.Agent({
  rejectUnauthorized: true, // Best practice: validate certificates
  secureProtocol: 'TLSv1_2_method', // Force TLSv1.2
  secureOptions: require('constants').SSL_OP_NO_TLSv1 | require('constants').SSL_OP_NO_TLSv1_1, // Disable older protocols
  ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256' // Modern ciphers
});

// Initialize the Azure OpenAI client with proper TLS settings
const client = new OpenAIClient(
  endpoint, 
  new AzureKeyCredential(apiKey),
  { httpClient: { httpAgent: azureHttpsAgent } }
);

/**
 * Chat with the Azure OpenAI model
 * @param {string} userInput - The user's message to the chatbot
 * @returns {Promise<string>} - The chatbot's response
 */
const chatWithBot = async (userInput) => {
  try {
    const response = await client.getChatCompletions(deploymentName, [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userInput }
    ]);

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error chatting with Azure OpenAI:", error);
    throw error;
  }
};

module.exports = {
  chatWithBot
}; 