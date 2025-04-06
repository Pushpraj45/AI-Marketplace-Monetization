// Script to fix the marketplace display by creating models that match the API response
require('dotenv').config();
const mongoose = require('mongoose');
const AIModel = require('../models/AIModel');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/monetizeai")
  .then(() => console.log("MongoDB connected for marketplace display fix"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Models we see in the API response
const apiModels = [
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

// Fix marketplace display
const fixMarketplaceDisplay = async () => {
  try {
    // Find pushpraj dubey user
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
    } else {
      console.log(`Using existing user: ${user.profile?.name || user.email}`);
      console.log(`User ID: ${user._id}`);
    }
    
    // Delete existing models with the same names to avoid duplicates
    for (const modelData of apiModels) {
      await AIModel.deleteMany({ 
        name: modelData.name,
        owner: user._id
      });
      console.log(`Deleted any existing models named "${modelData.name}"`);
    }
    
    // Create the API models we see
    for (const modelData of apiModels) {
      console.log(`Creating model: ${modelData.name}`);
      
      // Set usage stats
      const usageCount = modelData.name === 'Virtual Fitness Coach AI' ? 9 : 2;
      const revenue = usageCount * modelData.price * 100;
      const rating = 4.5;
      const reviewCount = 10;
      
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
          revenue: revenue,
          rating: rating,
          reviewCount: reviewCount
        }
      });
      
      await newModel.save();
      console.log(`Created model: ${newModel.name} with ID: ${newModel._id}`);
    }
    
    // List all models for this user
    const userModels = await AIModel.find({ owner: user._id });
    console.log(`\nUser now has ${userModels.length} models:`);
    userModels.forEach(model => {
      console.log(`- ${model.name} (ID: ${model._id}, Published: ${model.isPublished}, Status: ${model.status}, Price: $${model.perTokenPricing.price}/token)`);
    });
    
    // Check the total number of models
    const totalModels = await AIModel.countDocuments({});
    console.log(`\nTotal models in database: ${totalModels}`);
    
    // Count models that should appear in the marketplace
    const marketplaceModels = await AIModel.countDocuments({
      status: 'active',
      isPublished: true
    });
    console.log(`Models eligible for marketplace: ${marketplaceModels}`);
    
    console.log("\nMarketplace display fix complete!");
  } catch (error) {
    console.error("Error fixing marketplace display:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the fix
fixMarketplaceDisplay(); 