// Test script for making a direct API request to the AI completion endpoint
const axios = require('axios');

// Test model ID and messages
const testData = {
  modelId: "67f239adc332537af7b9dc62", // Use your actual model ID
  messages: [
    { role: "user", content: "Hello, how are you?" }
  ]
};

// API endpoint
const apiUrl = 'https://ai-marketplace-monetization.onrender.com/api/models/chat';

// Make the request
async function testApiRequest() {
  console.log("Testing AI completion API with direct request...");
  console.log("Request data:", JSON.stringify(testData, null, 2));
  
  try {
    const response = await axios.post(apiUrl, testData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with a valid token if needed
      }
    });
    
    console.log("API REQUEST SUCCESSFUL!");
    console.log("Status:", response.status);
    console.log("Response data:", JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error("API REQUEST FAILED:");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    console.error("Error config:", error.config);
    return false;
  }
}

// Run the test
testApiRequest()
  .then(success => {
    if (success) {
      console.log("\n✅ API TEST SUCCESSFUL!");
    } else {
      console.log("\n❌ API TEST FAILED.");
    }
  })
  .catch(err => {
    console.error("Uncaught error:", err);
  }); 