// Script to list available deployments
const axios = require('axios');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Azure OpenAI credentials
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;

// Create HTTPS agent with TLSv1.2
const httpsAgent = new https.Agent({
  rejectUnauthorized: true,
  secureProtocol: 'TLSv1_2_method',
  secureOptions: require('constants').SSL_OP_NO_TLSv1 | require('constants').SSL_OP_NO_TLSv1_1
});

async function listDeployments() {
  try {
    console.log("Attempting to list deployments...");
    
    // Configure axios with HTTPS agent
    const axiosInstance = axios.create({
      httpsAgent,
      headers: {
        'api-key': apiKey
      }
    });
    
    // List deployments endpoint
    const url = `${endpoint}openai/deployments?api-version=2023-12-01-preview`;
    console.log(`API URL: ${url}`);
    
    const response = await axiosInstance.get(url);
    console.log("Deployments:");
    console.log(JSON.stringify(response.data, null, 2));
    
    return { success: true };
  } catch (error) {
    console.error("ERROR:", error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, JSON.stringify(error.response.data, null, 2));
    }
    return { success: false };
  }
}

// Run the test
listDeployments()
  .then(result => {
    if (result.success) {
      console.log("✅ Successfully listed deployments");
      process.exit(0);
    } else {
      console.log("❌ Failed to list deployments");
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Uncaught error:", err);
    process.exit(1);
  }); 