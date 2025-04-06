const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// API base URL
const API_URL = 'http://localhost:5000/api';

// Function to test public chat API
async function testPublicChatAPI() {
  try {
    console.log('Testing Public Chat API...');
    
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
        `${API_URL}/chat/public`, 
        { message }
      );
      
      console.log(`Response status:`, response.status);
      console.log(`Response:`, response.data.data.response);
    }
    
    console.log('\n✅ Public Chat API test completed successfully!');
    return true;
  } catch (error) {
    console.error('Error testing Public Chat API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
}

// Run the test
testPublicChatAPI()
  .then(success => {
    if (success) {
      console.log('\nPublic Chat API is working correctly!');
      process.exit(0);
    } else {
      console.error('\nPublic Chat API test failed!');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Uncaught error:', err);
    process.exit(1);
  }); 