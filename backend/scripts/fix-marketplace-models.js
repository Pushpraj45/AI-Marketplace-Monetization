// Script to fix marketplace models and ensure they're all published
require('dotenv').config();
const mongoose = require('mongoose');
const AIModel = require('../models/AIModel');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/monetizeai")
  .then(() => console.log("MongoDB connected for fixing marketplace models"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Categories for marketplace models
const categories = [
  'Assistants',
  'Code',
  'Content',
  'Data',
  'Language',
  'Vision',
  'Business',
  'Education',
  'Healthcare',
  'Legal',
  'Science',
  'Marketing',
  'Health',
  'Travel',
  'Finance'
];

// Sample tags to use
const tagOptions = [
  'productivity',
  'ai-assistant',
  'automation',
  'smart-tools',
  'time-saver',
  'business',
  'education',
  'research',
  'writing',
  'coding',
  'data-analysis',
  'healthcare',
  'marketing',
  'legal',
  'travel',
  'finance',
  'entertainment',
  'translation',
  'creative',
  'professional'
];

// Fix marketplace models
const fixMarketplaceModels = async () => {
  try {
    // Count all models in the database
    const totalModels = await AIModel.countDocuments({});
    console.log(`Found ${totalModels} total models in the database`);

    // Count published models
    const publishedModels = await AIModel.countDocuments({ 
      status: "active", 
      isPublished: true 
    });
    console.log(`Found ${publishedModels} published models with active status`);

    // Add sample developer if none exists
    let developer = await User.findOne({ role: 'developer' });
    
    if (!developer) {
      developer = new User({
        email: 'developer@example.com',
        password: 'securepassword123',
        role: 'developer',
        isVerified: true,
        profile: {
          name: 'AI Developer',
          organization: 'AI Organization',
          bio: 'Professional AI developer specializing in creating AI models.'
        }
      });
      await developer.save();
      console.log('Created a new developer user');
    } else {
      console.log(`Using existing developer: ${developer.profile?.name || developer.email}`);
    }

    // Get all unpublished models
    const unpublishedModels = await AIModel.find({
      $or: [
        { isPublished: { $ne: true } },
        { status: { $ne: "active" } }
      ]
    });
    console.log(`Found ${unpublishedModels.length} unpublished or inactive models`);

    // Publish all unpublished models
    for (const model of unpublishedModels) {
      model.isPublished = true;
      model.status = "active";
      if (!model.publishedAt) {
        model.publishedAt = new Date();
      }
      // Ensure model has all required fields
      if (!model.name) {
        model.name = `AI Model ${Math.floor(Math.random() * 1000)}`;
      }
      if (!model.description) {
        model.description = 'An advanced AI model for various tasks and applications.';
      }
      if (!model.firstMessage) {
        model.firstMessage = 'Hello! How can I assist you today?';
      }
      
      await model.save();
      console.log(`Published model: ${model.name}`);
    }

    // Create additional models if fewer than 10 total
    if (totalModels < 10) {
      const numToCreate = 10 - totalModels;
      console.log(`Creating ${numToCreate} additional models to reach at least 10`);
      
      for (let i = 0; i < numToCreate; i++) {
        // Generate random model details
        const name = `AI Assistant ${i + 1}`;
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        // Select random tags (3-5 tags)
        const numTags = 3 + Math.floor(Math.random() * 3);
        const modelTags = [];
        for (let j = 0; j < numTags; j++) {
          const randomTag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
          if (!modelTags.includes(randomTag)) {
            modelTags.push(randomTag);
          }
        }
        
        // Random stats
        const usageCount = 100 + Math.floor(Math.random() * 1000);
        const revenue = (usageCount * 0.01) + Math.floor(Math.random() * 200);
        const rating = 3.5 + Math.random() * 1.5;
        const reviewCount = 5 + Math.floor(Math.random() * 45);
        
        // Create model
        const model = new AIModel({
          name: name,
          description: `A versatile ${category.toLowerCase()} AI assistant for various ${category.toLowerCase()} tasks.`,
          owner: developer._id,
          category: category,
          firstMessage: `Hello! I am ${name}, your AI assistant. How can I help you?`,
          systemPrompt: `You are ${name}, a helpful AI assistant specialized in ${category.toLowerCase()}.`,
          tags: modelTags,
          status: 'active',
          isPublished: true,
          publishedAt: new Date(),
          perTokenPricing: {
            enabled: true,
            price: 0.0001 + (Math.random() * 0.001)
          },
          stats: {
            usageCount: usageCount,
            revenue: revenue,
            rating: rating,
            reviewCount: reviewCount
          }
        });
        
        await model.save();
        console.log(`Created new model: ${model.name}`);
      }
    }
    
    // Ensure all models have an owner
    const modelsWithoutOwner = await AIModel.find({ owner: { $exists: false } });
    if (modelsWithoutOwner.length > 0) {
      console.log(`Found ${modelsWithoutOwner.length} models without an owner`);
      
      for (const model of modelsWithoutOwner) {
        model.owner = developer._id;
        await model.save();
        console.log(`Assigned owner to model: ${model.name}`);
      }
    }
    
    // List all models after fixes
    const allModels = await AIModel.find({}).populate('owner', 'profile.name email');
    console.log("\nAll models in database after fixes:");
    allModels.forEach(model => {
      const ownerName = model.owner?.profile?.name || model.owner?.email || 'Unknown owner';
      console.log(`- ${model.name} (Owner: ${ownerName}, Published: ${model.isPublished}, Status: ${model.status})`);
    });
    
    console.log("\nMarketplace model fixes complete!");
  } catch (error) {
    console.error("Error fixing marketplace models:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the fix script
fixMarketplaceModels(); 