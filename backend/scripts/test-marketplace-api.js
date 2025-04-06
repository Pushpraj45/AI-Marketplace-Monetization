// Script to test the marketplace API and debug what models are returned
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const AIModel = require('../models/AIModel');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/monetizeai")
  .then(() => console.log("MongoDB connected for API testing"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API URL
const API_URL = 'http://localhost:5000/api';

// Test the marketplace API directly
const testMarketplaceAPI = async () => {
  try {
    // First, check what's in the database directly
    const modelsInDB = await AIModel.find({ 
      status: 'active',
      isPublished: true
    }).populate('owner', 'profile.name email');
    
    console.log(`\nFound ${modelsInDB.length} eligible models in the database:`);
    modelsInDB.forEach((model, index) => {
      const ownerName = model.owner?.profile?.name || model.owner?.email || 'Unknown';
      console.log(`${index + 1}. ${model.name} (Owner: ${ownerName})`);
    });
    
    // Now test the API directly
    console.log("\nTesting API directly...");
    
    try {
      const response = await axios.get(`${API_URL}/models/marketplace`);
      
      if (response.data && response.data.success) {
        const apiModels = response.data.data;
        console.log(`\nAPI returned ${apiModels.length} models:`);
        
        apiModels.forEach((model, index) => {
          const ownerName = model.owner?.profile?.name || 'Unknown';
          console.log(`${index + 1}. ${model.name} (Owner: ${ownerName})`);
        });
        
        // Compare with database results
        console.log("\nComparing API results with database...");
        
        if (apiModels.length !== modelsInDB.length) {
          console.log(`⚠️ Mismatch: API returned ${apiModels.length} models, but database has ${modelsInDB.length} eligible models.`);
        } else {
          console.log("✅ Count matches: API and database have the same number of models.");
        }
        
        // Check if any models are missing from API response
        const apiModelIds = apiModels.map(model => model._id.toString());
        const missingModels = modelsInDB.filter(dbModel => 
          !apiModelIds.includes(dbModel._id.toString())
        );
        
        if (missingModels.length > 0) {
          console.log(`\n⚠️ Found ${missingModels.length} models in database that are missing from API response:`);
          missingModels.forEach((model, index) => {
            const ownerName = model.owner?.profile?.name || model.owner?.email || 'Unknown';
            console.log(`${index + 1}. ${model.name} (Owner: ${ownerName}, ID: ${model._id})`);
          });
        } else {
          console.log("\n✅ All database models are returned by the API.");
        }
        
        // Check if the API is filtering models somehow
        const modelsByOwner = {};
        apiModels.forEach(model => {
          const ownerName = model.owner?.profile?.name || 'Unknown';
          if (!modelsByOwner[ownerName]) {
            modelsByOwner[ownerName] = 0;
          }
          modelsByOwner[ownerName]++;
        });
        
        console.log("\nModels by owner in API response:");
        Object.entries(modelsByOwner).forEach(([owner, count]) => {
          console.log(`- ${owner}: ${count} models`);
        });
        
      } else {
        console.log("❌ API request failed: No data or success flag returned.");
        console.log("API Response:", response.data);
      }
    } catch (apiError) {
      console.log("❌ API request failed with error:", apiError.message);
      if (apiError.response) {
        console.log("Status:", apiError.response.status);
        console.log("Data:", apiError.response.data);
      }
    }
    
  } catch (error) {
    console.error("Error testing marketplace API:", error);
  } finally {
    mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  }
};

// Run the test
testMarketplaceAPI(); 