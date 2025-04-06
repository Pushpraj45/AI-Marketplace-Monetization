// Script to generate sample models for the AI Marketplace
require('dotenv').config();
const mongoose = require('mongoose');
const AIModel = require('../models/AIModel');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/monetizeai")
  .then(() => console.log("MongoDB connected for sample model generation"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configuration
const NUM_MODELS = 5; // Number of sample models to create

// Sample model data
const modelTemplates = [
  {
    name: 'GPT Assistant',
    description: 'A versatile AI assistant for general-purpose tasks and conversations.',
    category: 'Assistants',
    firstMessage: 'Hello! I am GPT Assistant, your AI helper. How can I assist you today?',
    systemPrompt: 'You are a helpful, friendly AI assistant designed to provide general assistance across a wide variety of topics.',
    capabilities: ['general-knowledge', 'conversation', 'writing-assistance', 'research-help']
  },
  {
    name: 'Code Helper',
    description: 'Specialized model for programming assistance and code generation.',
    category: 'Code',
    firstMessage: 'Welcome to Code Helper! Share your programming question or task, and I\'ll help you solve it.',
    systemPrompt: 'You are an expert programming assistant with deep knowledge across multiple languages and frameworks. Help users write, debug, and understand code.',
    capabilities: ['code-generation', 'debugging', 'algorithm-design', 'best-practices']
  },
  {
    name: 'Creative Writer',
    description: 'AI model focused on creative content generation and storytelling.',
    category: 'Content',
    firstMessage: 'Greetings, creative mind! I\'m here to help you with writing, storytelling, and creative content. What would you like to create today?',
    systemPrompt: 'You are a creative writing assistant with expertise in storytelling, poetry, scriptwriting and various creative formats.',
    capabilities: ['storytelling', 'poetry', 'scriptwriting', 'creative-ideation']
  },
  {
    name: 'Data Analyzer',
    description: 'Advanced analytical model for data processing and insights generation.',
    category: 'Data',
    firstMessage: 'Hello! I\'m your Data Analyzer assistant. Tell me about your data and what insights you\'re looking for.',
    systemPrompt: 'You are a data analysis expert who helps users understand, process, and extract insights from various types of data.',
    capabilities: ['data-analysis', 'statistics', 'data-visualization', 'insights-generation']
  },
  {
    name: 'Translation Pro',
    description: 'Multilingual translation model supporting over 50 languages.',
    category: 'Language',
    firstMessage: 'Welcome to Translation Pro! I can help you translate text between over 50 languages. What would you like to translate?',
    systemPrompt: 'You are a translation assistant with expertise in multiple languages. Help users translate text while preserving meaning, tone and cultural context.',
    capabilities: ['translation', 'language-learning', 'cultural-context', 'multi-language-communication']
  },
  {
    name: 'Image Descriptor',
    description: 'Vision model that analyzes and describes image content with precision.',
    category: 'Vision',
    firstMessage: 'Hello! I\'m Image Descriptor. Share images with me, and I\'ll provide detailed descriptions and analysis.',
    systemPrompt: 'You are a vision-based AI that specializes in analyzing and describing images in detail. Help users understand visual content.',
    capabilities: ['image-analysis', 'object-detection', 'scene-description', 'visual-content-summarization']
  }
];

// Pricing options
const pricingOptions = [
  {
    type: 'per-token',
    price: 0.00002
  },
  {
    type: 'per-token',
    price: 0.00005
  },
  {
    type: 'subscription',
    price: 9.99
  },
  {
    type: 'subscription',
    price: 19.99
  }
];

// Create sample models
const createSampleModels = async () => {
  try {
    // First, find a developer user
    const developerUser = await User.findOne({ role: 'developer' });
    
    if (!developerUser) {
      console.log("No developer user found. Please create a developer user first.");
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found developer user: ${developerUser.name} (${developerUser.email})`);
    
    // Clear existing sample models
    const existingCount = await AIModel.countDocuments({});
    if (existingCount > 0) {
      console.log(`Removing ${existingCount} existing models...`);
      await AIModel.deleteMany({});
    }
    
    // Create the sample models
    const modelPromises = [];
    const selectedTemplates = modelTemplates.slice(0, NUM_MODELS);
    
    for (const template of selectedTemplates) {
      // Select random pricing option
      const pricing = pricingOptions[Math.floor(Math.random() * pricingOptions.length)];
      
      // Create model with random variations
      const model = new AIModel({
        name: template.name,
        description: template.description,
        owner: developerUser._id,
        category: template.category,
        firstMessage: template.firstMessage,
        systemPrompt: template.systemPrompt,
        capabilities: template.capabilities,
        status: 'active',
        isPublished: true,
        publishedAt: new Date(),
        perTokenPricing: pricing.type === 'per-token' ? {
          enabled: true,
          price: pricing.price
        } : {
          enabled: false,
          price: 0
        },
        subscriptionPricing: pricing.type === 'subscription' ? {
          enabled: true,
          price: pricing.price
        } : {
          enabled: false,
          price: 0
        },
        stats: {
          usageCount: 100 + Math.floor(Math.random() * 900),
          revenue: 50 + Math.floor(Math.random() * 200)
        }
      });
      
      modelPromises.push(model.save());
      console.log(`Created model: ${template.name}`);
    }
    
    await Promise.all(modelPromises);
    console.log(`Successfully created ${NUM_MODELS} sample models!`);
    
    // List all models
    const allModels = await AIModel.find({});
    console.log("\nAll models in database:");
    allModels.forEach(model => {
      console.log(`- ${model.name} (ID: ${model._id}, Published: ${model.isPublished})`);
    });
    
    console.log("\nSample model generation complete!");
  } catch (error) {
    console.error("Error creating sample models:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the generator
createSampleModels(); 