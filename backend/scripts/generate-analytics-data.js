// Script to generate sample analytics data for testing the developer dashboard
require('dotenv').config();
const mongoose = require('mongoose');
const AIModel = require('../models/AIModel');
const ModelAnalytics = require('../models/ModelAnalytics');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/monetizeai")
  .then(() => console.log("MongoDB connected for analytics data generation"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configuration
const NUM_DAYS = 30; // Generate data for the last 30 days
const FORCE_GENERATE = false; // Set to false to use real published models
const NUM_FAKE_MODELS = 5; // Number of fake models to create if no real models exist

// Sample model data for generating fake models if needed
const modelTemplates = [
  {
    name: 'GPT Assistant',
    description: 'A versatile AI assistant for general-purpose tasks and conversations.',
    category: 'Assistants',
    popularity: 1.2
  },
  {
    name: 'Code Helper',
    description: 'Specialized model for programming assistance and code generation.',
    category: 'Code',
    popularity: 1.0
  },
  {
    name: 'Creative Writer',
    description: 'AI model focused on creative content generation and storytelling.',
    category: 'Content',
    popularity: 0.9
  },
  {
    name: 'Data Analyzer',
    description: 'Advanced analytical model for data processing and insights generation.',
    category: 'Data',
    popularity: 1.1
  },
  {
    name: 'Translation Pro',
    description: 'Multilingual translation model supporting over 50 languages.',
    category: 'Language',
    popularity: 0.8
  },
  {
    name: 'Image Descriptor',
    description: 'Vision model that analyzes and describes image content with precision.',
    category: 'Vision',
    popularity: 0.7
  }
];

const COUNTRIES = [
  'US', 'UK', 'CA', 'IN', 'AU', 
  'DE', 'FR', 'JP', 'BR', 'SG',
  'ES', 'IT', 'NL', 'SE', 'MX'
];

// Random generation helpers
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const getRandomCountry = () => COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];

// Function to generate random analytics data for a model for a specific date
const generateDailyAnalytics = async (model, date, popularityFactor = 1.0) => {
  // Define base load based on model age (newer models start with less traffic)
  const modelAgeInDays = Math.ceil((date - new Date(model.createdAt)) / (1000 * 60 * 60 * 24));
  const baseLoad = Math.min(modelAgeInDays * 2, 50) * popularityFactor; // Max base load of 50
  
  // Generate random data with some variations based on day of week (weekends have less traffic)
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const dailyFactor = isWeekend ? 0.7 : 1.0;
  
  // Interactions - adjust by model popularity and age
  const interactions = getRandomInt(
    Math.max(5, Math.floor(baseLoad * 0.8 * dailyFactor)), 
    Math.max(10, Math.floor(baseLoad * 1.2 * dailyFactor))
  );
  
  // Token counts
  const inputTokens = getRandomInt(interactions * 50, interactions * 100);
  const outputTokens = getRandomInt(interactions * 100, interactions * 250);
  
  // Revenue based on pricing model
  let revenue = 0;
  if (model.perTokenPricing && model.perTokenPricing.enabled && model.perTokenPricing.price > 0) {
    revenue = (inputTokens + outputTokens) * model.perTokenPricing.price;
  } else if (model.subscriptionPricing && model.subscriptionPricing.enabled) {
    // For subscription models, estimate revenue based on unique users
    const uniqueUsers = getRandomInt(Math.floor(interactions * 0.5), interactions);
    const subscriptionRate = 0.02; // 2% of users convert to subscription
    revenue = Math.floor(uniqueUsers * subscriptionRate) * model.subscriptionPricing.price / 30; // Daily revenue
  } else {
    // Default pricing for models without explicit pricing
    revenue = (inputTokens + outputTokens) * 0.00002;
  }
  
  // Response time simulation
  const avgResponseTime = getRandomFloat(0.5, 2.5); // 0.5 to 2.5 seconds
  const maxResponseTime = avgResponseTime * getRandomFloat(1.5, 3.0);
  
  // Geographic distribution - create random distribution with bias toward US
  const geoDistribution = new Map();
  for (let i = 0; i < interactions; i++) {
    const country = Math.random() < 0.4 ? 'US' : getRandomCountry();
    geoDistribution.set(country, (geoDistribution.get(country) || 0) + 1);
  }
  
  // Unique users (usually less than total interactions)
  const uniqueUsers = getRandomInt(Math.floor(interactions * 0.6), interactions);
  
  // Create and save analytics object
  const analytics = new ModelAnalytics({
    modelId: model._id,
    date,
    interactions,
    tokens: {
      input: inputTokens,
      output: outputTokens,
      total: inputTokens + outputTokens
    },
    revenue,
    uniqueUsers,
    responseTime: {
      average: avgResponseTime,
      max: maxResponseTime
    },
    geographicDistribution: Object.fromEntries(geoDistribution)
  });
  
  await analytics.save();
  
  return {
    interactions,
    revenue,
    tokens: inputTokens + outputTokens
  };
};

// Create temporary fake models if no real ones exist
const createTemporaryFakeModels = async (developerUser) => {
  const fakeModels = [];
  
  // Find a developer user if one wasn't provided
  if (!developerUser) {
    developerUser = await User.findOne({ role: 'developer' });
    
    if (!developerUser) {
      console.log("Warning: No developer user found. Creating temporary models without owner.");
    }
  }
  
  // Create temporary models (these won't be saved to the database)
  for (let i = 0; i < NUM_FAKE_MODELS; i++) {
    const template = modelTemplates[i % modelTemplates.length];
    const createdAt = new Date(Date.now() - getRandomInt(30, 90) * 24 * 60 * 60 * 1000);
    const publishedAt = new Date(createdAt.getTime() + getRandomInt(5, 15) * 24 * 60 * 60 * 1000);
    
    // Randomize pricing
    const usesTokenPricing = Math.random() > 0.5;
    const tokenPrice = getRandomFloat(0.00001, 0.00005);
    const subscriptionPrice = getRandomFloat(9.99, 29.99);
    
    const fakeModel = {
      _id: new mongoose.Types.ObjectId(),
      name: template.name,
      description: template.description,
      owner: developerUser ? developerUser._id : new mongoose.Types.ObjectId(),
      category: template.category,
      status: 'active',
      isPublished: true,
      createdAt,
      publishedAt,
      perTokenPricing: {
        enabled: usesTokenPricing,
        price: tokenPrice
      },
      subscriptionPricing: {
        enabled: !usesTokenPricing,
        price: subscriptionPrice
      },
      stats: {
        usageCount: 0,
        revenue: 0
      },
      popularity: template.popularity || 1.0
    };
    
    fakeModels.push(fakeModel);
    console.log(`Created temporary fake model: ${fakeModel.name} (ID: ${fakeModel._id})`);
  }
  
  return fakeModels;
};

// Main function to generate analytics data
const generateAnalyticsData = async () => {
  try {
    console.log("Starting analytics data generation...");
    
    // Find all published models
    let models = await AIModel.find({
      isPublished: true,
      status: "active"
    });
    
    let usingFakeModels = false;
    
    if (!models || models.length === 0) {
      if (FORCE_GENERATE) {
        console.log("No published models found. Creating temporary fake models for analytics generation...");
        models = await createTemporaryFakeModels();
        usingFakeModels = true;
      } else {
        console.log("No published models found. Please create some models first or set FORCE_GENERATE to true.");
        return;
      }
    }
    
    console.log(`Found ${models.length} models to generate data for.`);
    
    // Delete existing analytics data
    await ModelAnalytics.deleteMany({});
    console.log("Cleared existing analytics data.");
    
    // Generate data for each model for each day
    for (const model of models) {
      console.log(`Generating analytics for model: ${model.name}`);
      
      // Reset the model's overall statistics if it's a real model
      if (!usingFakeModels) {
        model.stats.usageCount = 0;
        model.stats.revenue = 0;
      }
      
      // Use popularity factor if available
      const popularityFactor = model.popularity || 1.0;
      
      // Generate data for the last NUM_DAYS
      for (let i = 0; i < NUM_DAYS; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        // Skip dates before the model was created
        if (date < new Date(model.createdAt)) continue;
        
        // Generate daily analytics with the model's popularity factor
        const dailyStats = await generateDailyAnalytics(model, date, popularityFactor);
        
        // Update model's aggregate stats if it's a real model
        if (!usingFakeModels) {
          model.stats.usageCount += dailyStats.interactions;
          model.stats.revenue += dailyStats.revenue;
        }
        
        console.log(`  - Generated data for ${date.toISOString().split('T')[0]}: ${dailyStats.interactions} interactions, $${dailyStats.revenue.toFixed(2)} revenue`);
      }
      
      // Save updated model stats if it's a real model
      if (!usingFakeModels) {
        await model.save();
      }
      console.log(`Completed data generation for model: ${model.name}`);
    }
    
    console.log("Analytics data generation completed successfully!");
  } catch (error) {
    console.error("Error generating analytics data:", error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the generator
generateAnalyticsData(); 