// Script to generate models for a specific user (pushpraj dubey)
require('dotenv').config();
const mongoose = require('mongoose');
const AIModel = require('../models/AIModel');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/monetizeai")
  .then(() => console.log("MongoDB connected for user model generation"))
  .catch((err) => console.error("MongoDB connection error:", err));

// List of models to create for the specific user
const userModels = [
  {
    name: 'Marketing Specialist',
    description: 'Expert in digital marketing strategies and campaign management.',
    firstMessage: 'Hello! I am your Marketing Specialist. How can I help with your marketing needs today?',
    systemPrompt: 'You are a marketing specialist with expertise in digital marketing, brand development, and campaign strategy.',
    tags: ['marketing', 'digital', 'campaign', 'professional']
  },
  {
    name: 'Sales Assistant',
    description: 'Virtual sales assistant for lead generation and conversion optimization.',
    firstMessage: 'Welcome! I am your Sales Assistant. How can I help boost your sales today?',
    systemPrompt: 'You are a sales assistant AI specializing in lead generation, conversion optimization, and sales strategy.',
    tags: ['sales', 'business', 'leads', 'conversion']
  },
  {
    name: 'Technical Writer',
    description: 'Creates clear technical documentation and instructions.',
    firstMessage: 'Hello! I can help you create technical documentation. What are you working on?',
    systemPrompt: 'You are a technical writer specializing in creating clear, concise documentation for technical products and services.',
    tags: ['writing', 'technical', 'documentation', 'professional']
  },
  {
    name: 'Language Tutor',
    description: 'Personal language tutor for learning multiple languages.',
    firstMessage: 'Greetings! I\'m your Language Tutor. Which language would you like to learn today?',
    systemPrompt: 'You are a language tutor AI with expertise in teaching multiple languages through conversation and exercises.',
    tags: ['education', 'language', 'learning', 'tutor']
  },
  {
    name: 'Financial Advisor',
    description: 'Provides financial planning advice and investment guidance.',
    firstMessage: 'Welcome! I\'m your Financial Advisor AI. How can I help with your financial questions today?',
    systemPrompt: 'You are a financial advisor AI that provides information on financial planning, investment strategies, and personal finance management.',
    tags: ['finance', 'advisor', 'investment', 'professional']
  },
  {
    name: 'Productivity Coach',
    description: 'Helps you optimize your workflow and improve productivity.',
    firstMessage: 'Hello! I\'m your Productivity Coach. Ready to make your workday more efficient?',
    systemPrompt: 'You are a productivity coach specializing in time management, workflow optimization, and efficiency strategies.',
    tags: ['productivity', 'time-management', 'efficiency', 'coach']
  },
  {
    name: 'Research Assistant',
    description: 'Helps with academic and professional research projects.',
    firstMessage: 'Greetings! I\'m your Research Assistant. What topic are we exploring today?',
    systemPrompt: 'You are a research assistant AI that helps users find, organize, and analyze information for academic and professional research.',
    tags: ['research', 'academic', 'information', 'analysis']
  }
];

// Generate models for the specific user
const generateUserModels = async () => {
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
          organization: 'AI Solutions',
          bio: 'AI model developer focused on business and productivity solutions.'
        }
      });
      await user.save();
      console.log('Created user: pushpraj dubey');
    } else {
      console.log(`Using existing user: ${user.profile?.name || user.email}`);
    }
    
    // Count existing models for this user
    const existingCount = await AIModel.countDocuments({ 
      owner: user._id 
    });
    
    console.log(`User currently has ${existingCount} models`);
    
    // Create models for the user
    const modelPromises = [];
    
    for (const modelTemplate of userModels) {
      // Check if model with this name already exists for this user
      const existingModel = await AIModel.findOne({ 
        owner: user._id,
        name: modelTemplate.name
      });
      
      if (existingModel) {
        console.log(`Model "${modelTemplate.name}" already exists for this user`);
        continue;
      }
      
      // Random usage stats
      const usageCount = 100 + Math.floor(Math.random() * 900);
      const revenue = (usageCount * 0.01) + Math.floor(Math.random() * 200);
      const rating = 4 + (Math.random() * 1);
      const reviewCount = 10 + Math.floor(Math.random() * 90);
      
      // Random price (per token)
      const price = 0.0001 + (Math.random() * 0.0009);
      
      // Create model
      const model = new AIModel({
        name: modelTemplate.name,
        description: modelTemplate.description,
        owner: user._id,
        firstMessage: modelTemplate.firstMessage,
        systemPrompt: modelTemplate.systemPrompt,
        tags: modelTemplate.tags,
        status: 'active',
        isPublished: true,
        publishedAt: new Date(),
        perTokenPricing: {
          enabled: true,
          price: price
        },
        stats: {
          usageCount: usageCount,
          revenue: revenue,
          rating: rating,
          reviewCount: reviewCount
        }
      });
      
      modelPromises.push(model.save());
      console.log(`Created model: ${model.name} for user ${user.profile?.name || user.email}`);
    }
    
    await Promise.all(modelPromises);
    
    // List all models for this user
    const userModelsInDB = await AIModel.find({ owner: user._id });
    console.log(`\nUser now has ${userModelsInDB.length} models in the database:`);
    userModelsInDB.forEach(model => {
      console.log(`- ${model.name} (Published: ${model.isPublished}, Status: ${model.status})`);
    });
    
    console.log("\nUser model generation complete!");
  } catch (error) {
    console.error("Error generating user models:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the generator
generateUserModels(); 