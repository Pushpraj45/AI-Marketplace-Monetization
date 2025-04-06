// Test the Azure OpenAI SDK version
const openai = require('@azure/openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;

console.log('Azure OpenAI SDK module:', openai);
console.log('Available exports:', Object.keys(openai));

// Check if OpenAIClient exists and its type
if (openai.OpenAIClient) {
  console.log('OpenAIClient exists and is of type:', typeof openai.OpenAIClient);
  console.log('OpenAIClient prototype methods:', Object.getOwnPropertyNames(openai.OpenAIClient.prototype));
}

// Check if AzureKeyCredential exists and its type
if (openai.AzureKeyCredential) {
  console.log('AzureKeyCredential exists and is of type:', typeof openai.AzureKeyCredential);
} else {
  console.log('AzureKeyCredential does not exist');
}

// Try to create a client with different approaches
try {
  // Approach 1: Using OpenAIClient directly with an API key string
  if (openai.OpenAIClient) {
    console.log('Attempting to create client with just API key...');
    const client1 = new openai.OpenAIClient(endpoint, apiKey);
    console.log('Successfully created client with just API key');
  }
} catch (err) {
  console.error('Error creating client with just API key:', err.message);
}

try {
  // Approach 2: Using OpenAIClient with AzureKeyCredential
  if (openai.OpenAIClient && openai.AzureKeyCredential) {
    console.log('Attempting to create client with AzureKeyCredential...');
    const credential = new openai.AzureKeyCredential(apiKey);
    const client2 = new openai.OpenAIClient(endpoint, credential);
    console.log('Successfully created client with AzureKeyCredential');
  }
} catch (err) {
  console.error('Error creating client with AzureKeyCredential:', err.message);
} 