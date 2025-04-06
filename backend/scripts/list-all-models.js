// Script to list all models in the database
require('dotenv').config();
const mongoose = require('mongoose');
const AIModel = require('../models/AIModel');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/monetizeai")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const listAllModels = async () => {
  try {
    // Count total models
    const totalModels = await AIModel.countDocuments({});
    console.log(`\nTotal models in database: ${totalModels}`);

    // Count models by status
    const activeModels = await AIModel.countDocuments({ status: 'active' });
    const draftModels = await AIModel.countDocuments({ status: 'draft' });
    const pendingModels = await AIModel.countDocuments({ status: 'pending-approval' });
    const rejectedModels = await AIModel.countDocuments({ status: 'rejected' });
    
    console.log(`\nModels by status:`);
    console.log(`- Active: ${activeModels}`);
    console.log(`- Draft: ${draftModels}`);
    console.log(`- Pending approval: ${pendingModels}`);
    console.log(`- Rejected: ${rejectedModels}`);

    // Count published vs unpublished
    const publishedModels = await AIModel.countDocuments({ isPublished: true });
    const unpublishedModels = await AIModel.countDocuments({ isPublished: false });
    
    console.log(`\nPublished vs Unpublished:`);
    console.log(`- Published: ${publishedModels}`);
    console.log(`- Unpublished: ${unpublishedModels}`);

    // Count models by owner (user)
    const users = await User.find({});
    console.log(`\nModels by owner:`);
    
    for (const user of users) {
      const modelCount = await AIModel.countDocuments({ owner: user._id });
      const name = user.profile?.name || user.email || 'Unknown';
      console.log(`- ${name}: ${modelCount} models`);
    }

    // Check for models that qualify for marketplace
    const marketplaceModels = await AIModel.countDocuments({ 
      status: 'active',
      isPublished: true
    });
    console.log(`\nModels eligible for marketplace: ${marketplaceModels}`);

    // List all models with their details
    console.log(`\nAll models in database:`);
    const allModels = await AIModel.find({}).populate('owner', 'profile.name email');
    
    allModels.forEach((model, index) => {
      const ownerName = model.owner?.profile?.name || model.owner?.email || 'Unknown owner';
      console.log(`\n${index + 1}. ${model.name}`);
      console.log(`   ID: ${model._id}`);
      console.log(`   Owner: ${ownerName}`);
      console.log(`   Status: ${model.status}`);
      console.log(`   Published: ${model.isPublished}`);
      console.log(`   Tags: ${model.tags ? model.tags.join(', ') : 'None'}`);
    });

  } catch (error) {
    console.error("Error listing models:", error);
  } finally {
    mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  }
};

listAllModels(); 