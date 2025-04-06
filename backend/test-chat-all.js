// Test runner for chat services
import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

// Configuration verification
console.log("Verifying Azure OpenAI configuration...");
console.log(`Endpoint: ${process.env.AZURE_OPENAI_ENDPOINT}`);
console.log(`Deployment: ${process.env.AZURE_DEPLOYMENT_NAME}`);
console.log(`API Key: ${process.env.AZURE_OPENAI_API_KEY ? "✅ Present" : "❌ Missing"}`);

// Function to run a test file
function runTest(testFile, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n\n==================================================`);
    console.log(`RUNNING ${description.toUpperCase()}`);
    console.log(`==================================================\n`);
    
    const process = exec(`node ${testFile}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running ${testFile}: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(stdout);
      resolve();
    });
    
    // Stream output for better debugging
    process.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    process.stderr.on('data', (data) => {
      console.error(data.toString());
    });
  });
}

// Run all tests
async function runAllTests() {
  try {
    // Simple chat test
    await runTest('./test-chat.js', 'Simple Chat Service Test');
    
    // Advanced chat test
    await runTest('./test-advanced-chat.js', 'Advanced Chat Service Test');
    
    console.log(`\n\n✅ All tests completed!`);
  } catch (error) {
    console.error(`❌ Test suite failed: ${error.message}`);
    process.exit(1);
  }
}

runAllTests(); 