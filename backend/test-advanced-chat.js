// Test script for advanced chat functionality
import dotenv from "dotenv";
import { chatWithBot } from "./advanced-chat-service.js";

dotenv.config();

async function testAdvancedChat() {
  try {
    console.log("Testing advanced chat functionality with Azure OpenAI...");
    
    // Array of test messages
    const testMessages = [
      // General conversation
      "Hello, can you introduce yourself?",
      
      // Lead creation
      "I want to create a lead for John Doe with email john.doe@example.com and phone +12345678901",
      
      // Lead update
      "Please update John Doe's phone to +19876543210",
      
      // Lead retrieval
      "What's the phone number of John Doe?",
      "What's the email of John Doe?",
      "Get lead details for John Doe",
      
      // Meeting scheduling
      "Schedule meeting for John Doe google meet https://meet.google.com/abc-defg-hij meeting at 2023-06-15T15:00 reminder at 2023-06-15T14:45",
      
      // Meeting details
      "What are the meeting details for John Doe?"
    ];
    
    // Test each message
    for (const message of testMessages) {
      console.log(`\n---------------------------------------------`);
      console.log(`Sending message: "${message}"`);
      
      const response = await chatWithBot(message);
      console.log(`\nResponse: "${response}"`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error testing advanced chat functionality:", error);
    return { success: false, error };
  }
}

// Run the test
testAdvancedChat()
  .then(result => {
    if (result.success) {
      console.log("\n✅ Advanced chat test SUCCESSFUL!");
      process.exit(0);
    } else {
      console.log("\n❌ Advanced chat test FAILED!");
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Uncaught error:", err);
    process.exit(1);
  }); 