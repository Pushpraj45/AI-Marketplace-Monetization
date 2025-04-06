// Simple test script with lower-level approach
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Azure OpenAI credentials
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;

// Create HTTPS agent with TLSv1.2
const httpsAgent = new https.Agent({
  rejectUnauthorized: true,
  secureProtocol: 'TLSv1_2_method'
});

// Test data
const requestData = JSON.stringify({
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Say hello in one sentence." }
  ],
  temperature: 0.7,
  max_tokens: 50
});

// Options for the HTTPS request
const options = {
  hostname: endpoint.replace('https://', ''),
  path: `/openai/deployments/${deploymentName}/chat/completions?api-version=2023-05-15`,
  method: 'POST',
  agent: httpsAgent,
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': requestData.length,
    'api-key': apiKey
  }
};

console.log(`Making request to: https://${options.hostname}${options.path}`);

// Make the HTTPS request
const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response headers:', res.headers);
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('Response data:', JSON.parse(responseData));
      console.log('✅ Success!');
    } else {
      console.log('Error response:', responseData);
      console.log('❌ Failed!');
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
  console.log('❌ Failed!');
});

// Send the request
req.write(requestData);
req.end(); 