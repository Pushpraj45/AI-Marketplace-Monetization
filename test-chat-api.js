const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// API base URL
const API_URL = 'http://localhost:3000/api';

// Test user credentials - update these with valid credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123'
};

// Function to get auth token
async function getAuthToken() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, TEST_USER);
    return response.data.token;
  } catch (error) {
    console.error('Error getting auth token:', error.message);
    throw error;
  }
}

// Function to test chat API
async function testChatAPI() {
  try {
    console.log('Testing Chat API...');
    
    // Get auth token
    const token = await getAuthToken();
    console.log('Got auth token:', token ? '✅' : '❌');
    
    // Configure axios with auth token
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    // Test messages
    const testMessages = [
      'Hello, how are you today?',
      'What services do you offer?',
      'Tell me a joke'
    ];
    
    // Test each message
    for (const message of testMessages) {
      console.log(`\n---------------------------------------------`);
      console.log(`Sending message: "${message}"`);
      
      const response = await axios.post(
        `${API_URL}/chat`, 
        { message }, 
        axiosConfig
      );
      
      console.log(`Response status:`, response.status);
      console.log(`Response:`, response.data.data.response);
    }
    
    console.log('\n✅ Chat API test completed successfully!');
    return true;
  } catch (error) {
    console.error('Error testing Chat API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
}

// Run the test
testChatAPI()
  .then(success => {
    if (success) {
      console.log('\nChat API is working correctly!');
      process.exit(0);
    } else {
      console.error('\nChat API test failed!');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Uncaught error:', err);
    process.exit(1);
  }); 