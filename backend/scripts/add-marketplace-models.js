// Script to add multiple models to the marketplace
require('dotenv').config();
const mongoose = require('mongoose');
const AIModel = require('../models/AIModel');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/monetizeai")
  .then(() => console.log("MongoDB connected for adding marketplace models"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Categories for models
const categories = ['Assistants', 'Code', 'Content', 'Data', 'Language', 'Business', 'Education', 'Science'];
const tags = ['ai', 'productivity', 'assistant', 'business', 'coding', 'writing', 'analysis', 'research'];

// Fixed models we want to create specifically
const specificModels = [
  {
    name: 'History',
    description: 'it works as history',
    tags: ['history', 'education'],
    price: 0.001
  },
  {
    name: 'Virtual Fitness Coach AI',
    description: 'Virtual Fitness Coach AI is an intelligent assistant designed to provide personalized workout plans, nutrition guidance, and motivation to users based on their fitness goals.',
    tags: ['fitness', 'workout', 'nutrition', 'health', 'personal coach', 'ai assistant'],
    price: 0.001
  },
  {
    name: 'Devendra Sahu',
    description: 'He is a financial advisor',
    tags: ['finance', 'advisor'],
    price: 0.00399
  }
];

// Add models to marketplace
const addMarketplaceModels = async () => {
  try {
    // Find or create the specific user (pushpraj dubey)
    let user = await User.findOne({ 
      $or: [
        { 'profile.name': 'pushpraj dubey' },
        { email: 'pushpraj@example.com' }
      ]
    });
    
    if (!user) {
      user = new User({
        email: 'pushpraj@example.com',
        password: 'securepassword123',
        role: 'developer',
        isVerified: true,
        profile: {
          name: 'pushpraj dubey',
          organization: 'AI Solutions (Na)',
          bio: 'AI model developer focused on business and productivity solutions.'
        }
      });
      await user.save();
      console.log('Created user: pushpraj dubey');
    }
    
    console.log(`Using user: ${user.profile?.name} (${user._id})`);
    
    // Clear existing models by this user
    const deleteResult = await AIModel.deleteMany({ owner: user._id });
    console.log(`Deleted ${deleteResult.deletedCount} existing models by this user`);
    
    // Create the specific models
    for (const modelData of specificModels) {
      // Set usage stats
      const usageCount = modelData.name === 'Virtual Fitness Coach AI' ? 9 : 2;
      
      // Create new model
      const newModel = new AIModel({
        name: modelData.name,
        description: modelData.description,
        owner: user._id,
        firstMessage: `Hello! I am ${modelData.name}. How can I assist you today?`,
        systemPrompt: `You are ${modelData.name}, a helpful AI assistant.`,
        tags: modelData.tags,
        status: 'active',
        isPublished: true,
        publishedAt: new Date(),
        perTokenPricing: {
          enabled: true,
          price: modelData.price
        },
        stats: {
          usageCount: usageCount,
          revenue: usageCount * modelData.price * 100,
          rating: 4.5,
          reviewCount: 10
        }
      });
      
      await newModel.save();
      console.log(`Created specific model: ${newModel.name} (ID: ${newModel._id})`);
    }
    
    // Add more random models (15 additional models)
    for (let i = 1; i <= 15; i++) {
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const modelName = `${randomCat} Assistant ${i}`;
      const description = `A powerful ${randomCat.toLowerCase()} assistant for your needs.`;
      
      // Random tags (3-4 tags)
      const modelTags = [];
      const numTags = 3 + Math.floor(Math.random() * 2);
      for (let j = 0; j < numTags; j++) {
        const randomTag = tags[Math.floor(Math.random() * tags.length)];
        if (!modelTags.includes(randomTag)) {
          modelTags.push(randomTag);
        }
      }
      
      // Random price
      const price = 0.0001 + (Math.random() * 0.001);
      
      // Random usage stats
      const usageCount = 10 + Math.floor(Math.random() * 190);
      
      // Create model
      const newModel = new AIModel({
        name: modelName,
        description: description,
        owner: user._id,
        firstMessage: `Hello! I am your ${randomCat} Assistant. How can I help you today?`,
        systemPrompt: `You are a helpful ${randomCat.toLowerCase()} assistant.`,
        tags: modelTags,
        status: 'active',
        isPublished: true,
        publishedAt: new Date(),
        perTokenPricing: {
          enabled: true,
          price: price
        },
        stats: {
          usageCount: usageCount,
          revenue: usageCount * price * 100,
          rating: 3.5 + (Math.random() * 1.5),
          reviewCount: 5 + Math.floor(Math.random() * 45)
        }
      });
      
      await newModel.save();
      console.log(`Created additional model: ${newModel.name} (ID: ${newModel._id})`);
    }
    
    // List final count of models
    const totalModels = await AIModel.countDocuments({});
    const userModels = await AIModel.countDocuments({ owner: user._id });
    const marketplaceModels = await AIModel.countDocuments({ 
      status: 'active',
      isPublished: true
    });
    
    console.log(`\nFinal counts:`);
    console.log(`- Total models in database: ${totalModels}`);
    console.log(`- Models by ${user.profile?.name}: ${userModels}`);
    console.log(`- Models eligible for marketplace: ${marketplaceModels}`);
    
    console.log("\nMarketplace models added successfully!");
  } catch (error) {
    console.error("Error adding marketplace models:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the function
addMarketplaceModels(); 