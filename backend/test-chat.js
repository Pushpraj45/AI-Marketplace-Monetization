// Test script for chat functionality
import dotenv from "dotenv";
import { chatWithBot } from "./chat-service.js";

dotenv.config();

async function testChatBot() {
  try {
    console.log("Testing chat functionality with Azure OpenAI...");
    
    // Test with a simple message
    const userMessage = "Hello, can you introduce yourself in one sentence?";
    console.log(`Sending message: "${userMessage}"`);
    
    const response = await chatWithBot(userMessage);
    console.log("\nResponse:", response);
    
    return { success: true };
  } catch (error) {
    console.error("Error testing chat functionality:", error);
    return { success: false, error };
  }
}

// Run the test
testChatBot()
  .then(result => {
    if (result.success) {
      console.log("\n✅ Chat test SUCCESSFUL!");
      process.exit(0);
    } else {
      console.log("\n❌ Chat test FAILED!");
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Uncaught error:", err);
    process.exit(1);
  }); 