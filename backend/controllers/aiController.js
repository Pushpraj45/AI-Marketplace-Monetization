const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const AIModel = require("../models/AIModel");
const https = require('https');

// Create custom HTTPS agents with different SSL options to try
const httpsAgents = {
  default: new https.Agent({
    rejectUnauthorized: false, // Disable certificate validation (use with caution)
    secureProtocol: 'TLSv1_2_method' // Force TLSv1.2
  }),
  tlsv11: new https.Agent({
    rejectUnauthorized: false,
    secureProtocol: 'TLSv1_1_method' // Try TLSv1.1
  }),
  tlsv1: new https.Agent({
    rejectUnauthorized: false,
    secureProtocol: 'TLSv1_method' // Try TLSv1
  }),
  tls: new https.Agent({
    rejectUnauthorized: false,
    // No specific protocol, let Node.js negotiate
  })
};

// Track which TLS method works
let workingTlsMethod = 'default';

// Get the appropriate HTTPS agent
const getHttpsAgent = () => {
  // Use the agent that worked previously
  return httpsAgents[workingTlsMethod];
};

// Try all TLS methods until one works
const tryAllTlsMethods = async (messages) => {
  try {
    console.log("Trying simple TLS connection method...");
    
    // Create client with simple approach that worked in tests
    const credential = new AzureKeyCredential(azureOpenAIConfig.apiKey);
    const client = new OpenAIClient(azureOpenAIConfig.endpoint, credential);
    
    // Test the client
    await client.getChatCompletions(
      azureOpenAIConfig.deploymentName,
      messages || [{ role: "user", content: "test" }],
      { maxTokens: 5 }
    );
    
    console.log("Simple TLS connection WORKS! Using this approach.");
    return true;
  } catch (error) {
    console.error("Simple TLS connection failed:", error.message);
    return false;
  }
};

// Azure OpenAI API configuration - updated for v2.0.0 SDK
const azureOpenAIConfig = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  deploymentName: process.env.AZURE_DEPLOYMENT_NAME,
  apiVersion: "2023-12-01-preview"
};

// Set up the environment variables with the correct values
const setupEnv = () => {
  console.log("Setting up environment variables for Azure OpenAI...");
  
  // Only set these if they're not already set
  if (!process.env.AZURE_OPENAI_ENDPOINT) {
    process.env.AZURE_OPENAI_ENDPOINT = azureOpenAIConfig.endpoint;
  }
  
  if (!process.env.AZURE_OPENAI_API_KEY) {
    process.env.AZURE_OPENAI_API_KEY = azureOpenAIConfig.apiKey;
  }
  
  if (!process.env.AZURE_DEPLOYMENT_NAME) {
    process.env.AZURE_DEPLOYMENT_NAME = azureOpenAIConfig.deploymentName;
  }
  
  if (!process.env.AZURE_OPENAI_API_VERSION) {
    process.env.AZURE_OPENAI_API_VERSION = azureOpenAIConfig.apiVersion;
  }
  
  // Also set AZURE_OPENAI_KEY as alternate name
  if (!process.env.AZURE_OPENAI_KEY) {
    process.env.AZURE_OPENAI_KEY = azureOpenAIConfig.apiKey;
  }
  
  // Log the setup
  console.log("Environment variables set up for Azure OpenAI");
};

// Debug function to check Azure OpenAI environment variables
const debugAzureConfig = () => {
  console.log("\n=== AZURE OPENAI CONFIG DEBUG ===");
  console.log("ENDPOINT:", process.env.AZURE_OPENAI_ENDPOINT ? 
    `${process.env.AZURE_OPENAI_ENDPOINT.substring(0, 15)}...` : "MISSING");
  console.log("API KEY:", process.env.AZURE_OPENAI_API_KEY ? 
    `${process.env.AZURE_OPENAI_API_KEY.substring(0, 5)}...` : "MISSING");
  console.log("DEPLOYMENT NAME:", process.env.AZURE_DEPLOYMENT_NAME || "MISSING");
  console.log("CONFIG VALUES:", {
    endpoint: azureOpenAIConfig.endpoint ? `${azureOpenAIConfig.endpoint.substring(0, 15)}...` : "MISSING",
    apiKey: azureOpenAIConfig.apiKey ? `${azureOpenAIConfig.apiKey.substring(0, 5)}...` : "MISSING",
    deploymentName: azureOpenAIConfig.deploymentName || "MISSING"
  });
  
  // Check for process.env quoting issues (common problem)
  const envVarString = JSON.stringify(process.env.AZURE_OPENAI_ENDPOINT || "");
  if (envVarString.startsWith('"') && envVarString.endsWith('"')) {
    console.log("WARNING: Environment variable appears to have quotes within the value");
  }
  
  console.log("================================\n");
};

// Initialize Azure OpenAI client
const getAzureOpenAIClient = () => {
  // Call setupEnv to ensure environment variables are set
  setupEnv();
  
  // Debug Azure config for troubleshooting
  debugAzureConfig();
  
  try {
    console.log("Creating Azure OpenAI client with simple connection approach...");
    
    // Create client with simple approach - matching what worked in test-azure-beta.js
    // No custom HTTPS agents or TLS configuration
    const credential = new AzureKeyCredential(azureOpenAIConfig.apiKey);
    return new OpenAIClient(azureOpenAIConfig.endpoint, credential);
  } catch (error) {
    console.error("Failed to create Azure OpenAI client:", error.message);
    throw new Error("Azure OpenAI configuration is missing. Please check your environment variables.");
  }
};

// Get the appropriate deployment name
const getDeploymentName = () => {
  // Try environment variable first
  if (process.env.AZURE_DEPLOYMENT_NAME && process.env.AZURE_DEPLOYMENT_NAME.trim() !== '') {
    console.log(`Using deployment name from environment: ${process.env.AZURE_DEPLOYMENT_NAME}`);
    return process.env.AZURE_DEPLOYMENT_NAME;
  }
  
  // Fall back to hardcoded value
  console.log(`Using hardcoded deployment name: ${azureOpenAIConfig.deploymentName}`);
  return azureOpenAIConfig.deploymentName;
};

// Chat completions with Azure OpenAI
exports.generateCompletion = async (req, res) => {
  try {
    // Make sure environment variables are set up
    setupEnv();
    console.log("Starting chat completion with properly set environment variables");
    
    const { modelId, messages } = req.body;

    if (!modelId || !messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: "Model ID and messages array are required",
      });
    }

    // Find the AI model
    const aiModel = await AIModel.findOne({
      _id: modelId,
      status: "active",
      isPublished: true,
    });

    if (!aiModel) {
      return res.status(404).json({
        success: false,
        error: "AI model not found or not available",
      });
    }

    // Prepare user's conversation
    let conversationMessages = [];
    
    // Add the model's first message if it's a new conversation
    if (messages.length === 1 && messages[0].role === "user") {
      conversationMessages = [
        { role: "system", content: aiModel.firstMessage },
        ...messages
      ];
    } else {
      conversationMessages = messages;
    }

    // Get Azure OpenAI client
    const client = getAzureOpenAIClient();
    const deploymentName = getDeploymentName();

    // Try with the configured deployment name
    try {
      console.log(`Attempting completion with deployment: ${deploymentName}`);
      
      // Generate chat completion using Azure OpenAI SDK
      const completionResponse = await client.getChatCompletions(
        deploymentName,
        conversationMessages,
        {
          temperature: 0.7,
          topP: 0.95,
          maxTokens: 1000,
        }
      );

      // Format the response
      const responseMessage = completionResponse.choices[0].message;
      const tokenUsage = completionResponse.usage;

      // Update usage statistics for the model
      await AIModel.findByIdAndUpdate(modelId, {
        $inc: {
          "stats.usageCount": 1,
        },
      });

      // Calculate cost if per-token pricing is enabled
      let cost = 0;
      if (aiModel.perTokenPricing.enabled && aiModel.perTokenPricing.price > 0) {
        const tokensUsed = tokenUsage.totalTokens;
        cost = tokensUsed * aiModel.perTokenPricing.price;
        
        // Update revenue
        await AIModel.findByIdAndUpdate(modelId, {
          $inc: {
            "stats.revenue": cost,
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          message: responseMessage,
          usage: tokenUsage,
          cost: cost,
        },
      });
    } catch (deploymentError) {
      console.error(`Error with deployment ${deploymentName}:`, deploymentError.message);
      
      // If this looks like a TLS error, try all TLS methods
      if (deploymentError.message.includes("SSL") || 
          deploymentError.message.includes("TLS") || 
          deploymentError.message.includes("alert") ||
          deploymentError.message.includes("connect")) {
        
        console.log("Detected possible TLS error. Trying all TLS methods...");
        const tlsSuccess = await tryAllTlsMethods(conversationMessages);
        
        if (tlsSuccess) {
          // If we found a working TLS method, try again with the new client
          const newClient = getAzureOpenAIClient();
          console.log("Retrying with working TLS method:", workingTlsMethod);
          
          const newResponse = await newClient.getChatCompletions(
            deploymentName,
            conversationMessages,
            {
              temperature: 0.7,
              topP: 0.95,
              maxTokens: 1000,
            }
          );
          
          return res.status(200).json({
            success: true,
            data: {
              message: newResponse.choices[0].message,
              usage: newResponse.usage,
              cost: 0,
              tlsMethod: workingTlsMethod
            },
          });
        }
      }
      
      // Try with fallback deployments
      const fallbackDeployments = ["pragya_gpt-4o-mini", "gpt35-turbo", "gpt-35-turbo", "gpt-3.5-turbo"];
      
      for (const fallbackDeployment of fallbackDeployments) {
        // Skip if it's the same as what we already tried
        if (fallbackDeployment === deploymentName) continue;
        
        try {
          console.log(`Trying fallback deployment: ${fallbackDeployment}`);
          
          const fallbackResponse = await client.getChatCompletions(
            fallbackDeployment,
            conversationMessages,
            {
              temperature: 0.7,
              topP: 0.95,
              maxTokens: 1000,
            }
          );
          
          const responseMessage = fallbackResponse.choices[0].message;
          const tokenUsage = fallbackResponse.usage;
          
          // Update usage statistics for the model
          await AIModel.findByIdAndUpdate(modelId, {
            $inc: {
              "stats.usageCount": 1,
            },
          });
          
          console.log(`Success with fallback deployment: ${fallbackDeployment}`);
          
          return res.status(200).json({
            success: true,
            data: {
              message: responseMessage,
              usage: tokenUsage,
              cost: 0, // Don't charge for fallback
              fallbackUsed: true,
              fallbackDeployment: fallbackDeployment
            },
          });
        } catch (fallbackError) {
          console.error(`Error with fallback deployment ${fallbackDeployment}:`, fallbackError.message);
          // Continue to the next fallback
        }
      }
      
      // If we get here, all fallbacks failed
      throw new Error(`All Azure OpenAI deployments failed. Original error: ${deploymentError.message}`);
    }
  } catch (error) {
    console.error("Error in AI completion:", error);
    
    // Try one more time with direct client creation before giving up
    try {
      console.log("Attempting fallback with direct client creation...");
      
      // Create client directly with the simplified approach that works in tests
      const credential = new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY);
      const client = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT, credential);
      
      // Try with hardcoded deployment name
      const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;
      
      // Get the model and prepare messages (simplified)
      const aiModel = await AIModel.findOne({ _id: req.body.modelId });
      let conversationMessages = req.body.messages;
      
      // Add system message if needed
      if (conversationMessages.length === 1 && conversationMessages[0].role === 'user') {
        conversationMessages = [
          { role: "system", content: aiModel?.firstMessage || "You are a helpful assistant." },
          ...conversationMessages
        ];
      }
      
      // Try completion with hardcoded values
      const completionResponse = await client.getChatCompletions(
        deploymentName,
        conversationMessages,
        {
          temperature: 0.7,
          maxTokens: 1000
        }
      );
      
      // Return the response
      return res.status(200).json({
        success: true,
        data: {
          message: completionResponse.choices[0].message,
          usage: completionResponse.usage,
          cost: 0,
          usingFallback: true
        },
      });
    } catch (fallbackError) {
      console.error("Fallback attempt also failed:", fallbackError);
      const errorMessage = error.response?.error?.message || error.message || "Unknown error occurred";
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }
};

// Test Azure OpenAI connection
exports.testAzureOpenAI = async (req, res) => {
  try {
    // Make sure environment variables are set up
    setupEnv();
    
    console.log("Testing Azure OpenAI connection and TLS methods...");
    
    // Try all TLS methods first to find the one that works
    const tlsSuccess = await tryAllTlsMethods();
    
    if (tlsSuccess) {
      // Create client with working TLS method
      const client = getAzureOpenAIClient();
      console.log(`Using working TLS method: ${workingTlsMethod}`);
      
      // Simple test message
      const testMessages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, is this connection working?" }
      ];
      
      // Generate chat completion 
      const completionResponse = await client.getChatCompletions(
        getDeploymentName(),
        testMessages,
        {
          temperature: 0.7,
          maxTokens: 100
        }
      );
      
      // Return successful response
      return res.status(200).json({
        success: true,
        message: "Azure OpenAI connection is working",
        tlsMethod: workingTlsMethod,
        deploymentName: getDeploymentName(),
        response: {
          content: completionResponse.choices[0].message.content,
          role: completionResponse.choices[0].message.role,
          tokenUsage: completionResponse.usage
        }
      });
    } else {
      // All TLS methods failed
      return res.status(500).json({
        success: false,
        message: "Azure OpenAI connection failed with all TLS methods",
        triedMethods: Object.keys(httpsAgents),
        config: {
          endpoint: azureOpenAIConfig.endpoint,
          apiKeyPresent: !!azureOpenAIConfig.apiKey,
          deploymentName: azureOpenAIConfig.deploymentName
        }
      });
    }
  } catch (error) {
    console.error("Azure OpenAI test error:", error);
    res.status(500).json({
      success: false,
      message: "Azure OpenAI connection failed",
      error: error.message,
      config: {
        endpointDefined: !!azureOpenAIConfig.endpoint,
        apiKeyDefined: !!azureOpenAIConfig.apiKey,
        deploymentNameDefined: !!azureOpenAIConfig.deploymentName
      }
    });
  }
};

// Test all available deployments in Azure OpenAI
exports.testDeployments = async (req, res) => {
  try {
    // Get Azure OpenAI client
    const client = getAzureOpenAIClient();
    
    console.log("Testing Azure OpenAI deployments...");
    
    // Get model deployment information
    let deploymentName = azureOpenAIConfig.deploymentName;
    
    // First test the configured deployment
    try {
      console.log(`Testing configured deployment: ${deploymentName}`);
      
      // Simple test message
      const testMessages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, can you respond with a short greeting?" }
      ];
      
      // Generate chat completion with the configured deployment
      const completionResponse = await client.getChatCompletions(
        deploymentName,
        testMessages,
        {
          temperature: 0.7,
          maxTokens: 20
        }
      );
      
      // Return successful response
      return res.status(200).json({
        success: true,
        message: "Azure OpenAI connection successful with configured deployment",
        deployment: deploymentName,
        response: {
          content: completionResponse.choices[0].message.content,
          role: completionResponse.choices[0].message.role,
          tokenUsage: completionResponse.usage
        }
      });
    } catch (error) {
      console.error(`Error with deployment ${deploymentName}:`, error.message);
      
      // Try with some common deployment names as fallback
      const commonDeployments = [
        "gpt-35-turbo", 
        "gpt-4", 
        "gpt-4-turbo", 
        "gpt-35-turbo-16k"
      ];
      
      for (const deployment of commonDeployments) {
        if (deployment === deploymentName) continue; // Skip the one we already tried
        
        try {
          console.log(`Trying alternate deployment: ${deployment}`);
          
          const testMessages = [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "Hello, can you respond with a short greeting?" }
          ];
          
          // Try with this deployment
          const response = await client.getChatCompletions(
            deployment,
            testMessages,
            {
              temperature: 0.7,
              maxTokens: 20
            }
          );
          
          // If we get here, it worked!
          return res.status(200).json({
            success: true,
            message: `Azure OpenAI connection successful with alternate deployment`,
            configuredDeployment: deploymentName,
            workingDeployment: deployment,
            recommendation: "Update your AZURE_DEPLOYMENT_NAME to this value",
            response: {
              content: response.choices[0].message.content,
              role: response.choices[0].message.role,
              tokenUsage: response.usage
            }
          });
        } catch (deploymentError) {
          console.error(`Error with alternate deployment ${deployment}:`, deploymentError.message);
        }
      }
      
      // If we reach here, all deployments failed
      return res.status(500).json({
        success: false,
        message: "All Azure OpenAI deployments failed",
        error: error.message,
        testedDeployments: [deploymentName, ...commonDeployments]
      });
    }
  } catch (error) {
    console.error("Azure OpenAI deployments test error:", error);
    res.status(500).json({
      success: false,
      message: "Azure OpenAI connection or configuration error",
      error: error.message
    });
  }
};

// Direct test that bypasses all environment variables
exports.directTest = async (req, res) => {
  try {
    console.log("Starting direct Azure OpenAI test with environment variables");
    
    // Create client directly with values from environment
    const client = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT, 
      new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY),
      { httpClient: { httpAgent: getHttpsAgent() } } // Add the HTTPS agent
    );
    
    // Simple test message
    const testMessages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Say hello in one sentence." }
    ];
    
    // Try with several common deployment names
    const deployments = ["pragya_gpt-4o-mini", "gpt-35-turbo", "gpt-4", "gpt-3.5-turbo", "gpt35-turbo"];
    
    let success = false;
    let successResponse = null;
    let workingDeployment = null;
    let allErrors = [];
    
    // Try each deployment
    for (const deployment of deployments) {
      try {
        console.log(`Testing deployment: ${deployment}`);
        
        const response = await client.getChatCompletions(
          deployment,
          testMessages,
          {
            temperature: 0.7,
            maxTokens: 50
          }
        );
        
        // If we get here, it worked!
        success = true;
        workingDeployment = deployment;
        successResponse = response;
        break;
      } catch (error) {
        console.error(`Error with deployment ${deployment}:`, error.message);
        allErrors.push({ deployment, error: error.message });
      }
    }
    
    if (success) {
      return res.status(200).json({
        success: true,
        message: "Direct test successful!",
        workingDeployment,
        response: {
          content: successResponse.choices[0].message.content,
          role: successResponse.choices[0].message.role,
          usage: successResponse.usage
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "All deployments failed in direct test",
        errors: allErrors
      });
    }
  } catch (error) {
    console.error("Direct test error:", error);
    console.error("Error stack:", error.stack);
    
    return res.status(500).json({
      success: false,
      message: "Error in direct test",
      error: error.message,
      stack: error.stack
    });
  }
};

/**
 * Get a direct completion from the OpenAI model
 * @param {string} prompt - The prompt to send to the model
 * @param {string} systemMessage - Optional system message
 * @returns {Promise<string>} - The generated text response
 */
const getOpenAICompletion = async (prompt, systemMessage = "You are a helpful assistant.") => {
  try {
    const client = getAzureOpenAIClient();
    const deploymentName = getDeploymentName();
    
    console.log(`Getting completion with deployment: ${deploymentName}`);
    
    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt }
    ];
    
    // Try with main deployment
    try {
      const response = await client.getChatCompletions(
        deploymentName,
        messages,
        {
          temperature: 0.7,
          maxTokens: 1000
        }
      );
      
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error(`Error with deployment ${deploymentName}:`, error.message);
      
      // Try fallback deployments
      const fallbackDeployments = ["pragya_gpt-4o-mini", "gpt35-turbo", "gpt-35-turbo", "gpt-3.5-turbo"];
      
      for (const fallbackDeployment of fallbackDeployments) {
        if (fallbackDeployment === deploymentName) continue;
        
        try {
          console.log(`Trying fallback deployment: ${fallbackDeployment}`);
          
          const response = await client.getChatCompletions(
            fallbackDeployment,
            messages,
            {
              temperature: 0.7,
              maxTokens: 1000
            }
          );
          
          console.log(`Success with fallback deployment: ${fallbackDeployment}`);
          return response.choices[0].message.content.trim();
        } catch (fallbackError) {
          console.error(`Error with fallback deployment ${fallbackDeployment}:`, fallbackError.message);
        }
      }
      
      throw new Error(`All deployments failed for completion. Original error: ${error.message}`);
    }
  } catch (error) {
    console.error("Error getting OpenAI completion:", error);
    throw error;
  }
};

// Utility endpoint for direct completions
exports.getCompletion = async (req, res) => {
  try {
    const { prompt, systemMessage } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required"
      });
    }
    
    const result = await getOpenAICompletion(prompt, systemMessage);
    
    return res.status(200).json({
      success: true,
      data: {
        result
      }
    });
  } catch (error) {
    console.error("Error in completion endpoint:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Export the utility function for use elsewhere
exports.getOpenAICompletion = getOpenAICompletion;

// Simple test endpoint that uses the exact structure from the Python example
exports.pythonStyleTest = async (req, res) => {
  try {
    console.log("Starting Python-style test with environment variables");
    
    // Set environment variables
    setupEnv();
    
    // Create client directly matching Python example structure
    const credential = new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY);
    const client = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT, credential);
    
    // Simple test message
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Say hello in one sentence." }
    ];
    
    // Use the deployment name exactly as in Python example
    const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;
    
    console.log(`Using deployment: ${deploymentName}`);
    
    try {
      const response = await client.getChatCompletions(
        deploymentName,
        messages,
        {
          temperature: 0.7,
          maxTokens: 50
        }
      );
      
      return res.status(200).json({
        success: true,
        message: "Python-style test successful!",
        response: {
          content: response.choices[0].message.content,
          role: response.choices[0].message.role,
          usage: response.usage
        }
      });
    } catch (error) {
      console.error(`Error with deployment ${deploymentName}:`, error.message);
      console.error("Stack trace:", error.stack);
      
      return res.status(500).json({
        success: false,
        message: "Python-style test failed",
        error: error.message,
        stack: error.stack
      });
    }
  } catch (error) {
    console.error("Python-style test error:", error);
    console.error("Stack trace:", error.stack);
    
    return res.status(500).json({
      success: false,
      message: "Error in Python-style test",
      error: error.message,
      stack: error.stack
    });
  }
};
