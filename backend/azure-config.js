// Azure OpenAI TLS configuration helper
const https = require('https');

// Create a properly configured HTTPS agent for Azure OpenAI
function createAzureHttpsAgent() {
  return new https.Agent({
    rejectUnauthorized: true, // Best practice: validate certificates
    secureProtocol: 'TLSv1_2_method', // Force TLSv1.2
    secureOptions: require('constants').SSL_OP_NO_TLSv1 | require('constants').SSL_OP_NO_TLSv1_1, // Disable older protocols
    ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256' // Modern ciphers
  });
}

// For Axios
function configureAxiosForAzure(axios, apiKey) {
  return axios.create({
    httpsAgent: createAzureHttpsAgent(),
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    }
  });
}

// For the Azure OpenAI SDK
const azureClientOptions = {
  httpClient: {
    httpAgent: createAzureHttpsAgent()
  }
};

module.exports = {
  createAzureHttpsAgent,
  configureAxiosForAzure,
  azureClientOptions
}; 