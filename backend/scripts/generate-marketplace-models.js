// Script to generate marketplace models with random developer names, tags, and prices
require('dotenv').config();
const mongoose = require('mongoose');
const AIModel = require('../models/AIModel');
const User = require('../models/User');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/monetizeai")
  .then(() => console.log("MongoDB connected for marketplace model generation"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configuration
const NUM_MODELS = 10; // Number of marketplace models to create

// Sample model data
const modelTemplates = [
  {
    name: 'TextGenPro',
    description: 'Advanced text generation with creative abilities.',
    category: 'Content',
    firstMessage: 'Hello! I am TextGenPro, ready to help you create amazing content.',
    systemPrompt: 'You are a specialized content creation AI designed to generate high-quality text across multiple formats.',
    capabilities: ['content-creation', 'storytelling', 'copywriting', 'creative-writing']
  },
  {
    name: 'CodeMaster',
    description: 'Professional coding assistant for developers of all levels.',
    category: 'Code',
    firstMessage: 'Welcome to CodeMaster! What coding challenge are you working on today?',
    systemPrompt: 'You are an expert coding assistant with deep knowledge of multiple programming languages and frameworks.',
    capabilities: ['code-generation', 'debugging', 'refactoring', 'code-review']
  },
  {
    name: 'DataVisionary',
    description: 'Specialized in data analysis and visualization techniques.',
    category: 'Data',
    firstMessage: 'Ready to transform your data into insights. What data are we working with today?',
    systemPrompt: 'You are a data analysis expert who helps users understand complex datasets and create meaningful visualizations.',
    capabilities: ['data-analysis', 'statistics', 'visualization', 'predictive-modeling']
  },
  {
    name: 'LanguageBridge',
    description: 'Professional translation and language learning assistant.',
    category: 'Language',
    firstMessage: 'Greetings! I can translate between 75+ languages or help you learn a new one.',
    systemPrompt: 'You are a multilingual assistant specializing in accurate translations and language instruction.',
    capabilities: ['translation', 'language-teaching', 'grammar-correction', 'cultural-context']
  },
  {
    name: 'BusinessGPT',
    description: 'AI assistant for business strategy, marketing, and operations.',
    category: 'Business',
    firstMessage: 'Welcome to BusinessGPT. How can I assist with your business needs today?',
    systemPrompt: 'You are a business consultant AI with expertise in strategy, marketing, operations, and finance.',
    capabilities: ['business-planning', 'market-analysis', 'financial-modeling', 'strategy-development']
  },
  {
    name: 'EdTech Tutor',
    description: 'Educational assistant for students and teachers.',
    category: 'Education',
    firstMessage: 'Hello! I\'m your EdTech Tutor. What subject would you like to explore today?',
    systemPrompt: 'You are an educational assistant designed to help with learning across various subjects and grade levels.',
    capabilities: ['tutoring', 'lesson-planning', 'quiz-generation', 'concept-explanation']
  },
  {
    name: 'MediBot Pro',
    description: 'Healthcare information assistant for medical professionals.',
    category: 'Healthcare',
    firstMessage: 'Welcome to MediBot Pro. Please note I provide information only and do not offer medical advice.',
    systemPrompt: 'You are a healthcare information assistant that helps medical professionals access relevant information quickly.',
    capabilities: ['medical-research', 'healthcare-information', 'medical-terminology', 'literature-review']
  },
  {
    name: 'LegalAssist',
    description: 'Legal research and document preparation assistant.',
    category: 'Legal',
    firstMessage: 'Welcome to LegalAssist. I can help with legal research and document drafting.',
    systemPrompt: 'You are a legal assistant AI that helps with research, document preparation, and legal information.',
    capabilities: ['legal-research', 'document-preparation', 'case-summarization', 'legal-information']
  },
  {
    name: 'ScienceGPT',
    description: 'Scientific research and paper writing assistant.',
    category: 'Science',
    firstMessage: 'Hello! I\'m your scientific research assistant. What area of science are we exploring today?',
    systemPrompt: 'You are a science assistant with broad knowledge across scientific disciplines and research methodologies.',
    capabilities: ['research-assistance', 'paper-writing', 'literature-review', 'experimental-design']
  },
  {
    name: 'MarketingPro',
    description: 'Marketing strategy and content creation specialist.',
    category: 'Marketing',
    firstMessage: 'Welcome to MarketingPro! Let\'s grow your brand together.',
    systemPrompt: 'You are a marketing specialist AI with expertise in strategy, content creation, and campaign planning.',
    capabilities: ['content-creation', 'campaign-planning', 'market-research', 'brand-strategy']
  },
  {
    name: 'AI Therapist',
    description: 'Supportive conversation partner for mental wellness.',
    category: 'Health',
    firstMessage: 'Hello, I\'m here to listen and support you. How are you feeling today?',
    systemPrompt: 'You are a supportive conversation partner designed to provide empathetic responses and wellness information.',
    capabilities: ['active-listening', 'emotional-support', 'wellness-information', 'stress-management']
  },
  {
    name: 'TravelGuide',
    description: 'Virtual travel assistant and recommendation engine.',
    category: 'Travel',
    firstMessage: 'Welcome traveler! Where would you like to explore today?',
    systemPrompt: 'You are a travel guide AI with knowledge of global destinations, customs, and travel planning.',
    capabilities: ['destination-recommendations', 'itinerary-planning', 'travel-tips', 'cultural-information']
  }
];

// Developer name options
const developerNames = [
  'AI Innovations',
  'NeuralTech Solutions',
  'Quantum AI Labs',
  'FutureMind Technologies',
  'DeepThought Systems',
  'Cognition Technologies',
  'Synthetic Minds Inc.',
  'Neural Network Group',
  'AI Frontier',
  'SmartAlgo Labs',
  'Intelligent Systems Co.',
  'BrainWave Technologies',
  'Cognitive Computing Group',
  'AICore Developments',
  'Machine Intelligence Ltd.'
];

// Tags options
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

// Pricing options
const pricingOptions = [
  {
    type: 'per-token',
    price: 0.00001
  },
  {
    type: 'per-token',
    price: 0.00002
  },
  {
    type: 'per-token',
    price: 0.00005
  },
  {
    type: 'per-token',
    price: 0.0001
  },
  {
    type: 'subscription',
    price: 4.99
  },
  {
    type: 'subscription',
    price: 9.99
  },
  {
    type: 'subscription',
    price: 19.99
  },
  {
    type: 'subscription',
    price: 29.99
  }
];

// Create or find developer users and then create models
const createMarketplaceModels = async () => {
  try {
    // Create developer users if they don't exist
    const developerPromises = [];
    
    for (const devName of developerNames) {
      const normalizedEmail = devName.toLowerCase()
        .replace(/\s+inc\.?/i, '')  // Remove "Inc." including the period
        .replace(/\s+co\.?/i, '')   // Remove "Co." including the period
        .replace(/\s+ltd\.?/i, '')  // Remove "Ltd." including the period
        .replace(/\s+/g, '')        // Remove remaining spaces
        + '@example.com';
      
      const existingDev = await User.findOne({ email: normalizedEmail });
      
      if (!existingDev) {
        const newDev = new User({
          email: normalizedEmail,
          password: 'securepassword123', // In a real app, would use a secure random password
          role: 'developer',
          isVerified: true,
          profile: {
            name: devName,
            organization: `${devName} Organization`,
            bio: `${devName} is a leading AI development company specializing in innovative AI solutions.`
          }
        });
        
        developerPromises.push(newDev.save());
        console.log(`Created developer: ${devName}`);
      } else {
        console.log(`Developer already exists: ${devName}`);
        developerPromises.push(Promise.resolve(existingDev));
      }
    }
    
    const developers = await Promise.all(developerPromises);
    console.log(`Successfully processed ${developers.length} developers`);
    
    // Create the marketplace models
    const modelPromises = [];
    
    // Select random model templates
    const selectedTemplates = [];
    for (let i = 0; i < NUM_MODELS; i++) {
      const randomTemplateIndex = Math.floor(Math.random() * modelTemplates.length);
      selectedTemplates.push(modelTemplates[randomTemplateIndex]);
    }
    
    for (const template of selectedTemplates) {
      // Select random developer
      const developer = developers[Math.floor(Math.random() * developers.length)];
      
      // Select random pricing option
      const pricing = pricingOptions[Math.floor(Math.random() * pricingOptions.length)];
      
      // Select random tags (3-5 tags)
      const numTags = 3 + Math.floor(Math.random() * 3);
      const modelTags = [];
      for (let i = 0; i < numTags; i++) {
        const randomTag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
        if (!modelTags.includes(randomTag)) {
          modelTags.push(randomTag);
        }
      }
      
      // Random usage stats
      const usageCount = 100 + Math.floor(Math.random() * 9900);
      const revenue = (usageCount * 0.01) + Math.floor(Math.random() * 500);
      const rating = 3.5 + Math.random() * 1.5;
      const reviewCount = 5 + Math.floor(Math.random() * 95);
      
      // Create model
      const model = new AIModel({
        name: `${template.name} by ${developer.profile.name}`,
        description: template.description,
        owner: developer._id,
        category: template.category,
        firstMessage: template.firstMessage,
        systemPrompt: template.systemPrompt,
        capabilities: template.capabilities,
        tags: modelTags,
        status: 'active',
        isPublished: true,
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)), // Random date in the last 90 days
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
          usageCount: usageCount,
          revenue: revenue,
          rating: rating,
          reviewCount: reviewCount
        }
      });
      
      modelPromises.push(model.save());
      console.log(`Created marketplace model: ${model.name}`);
    }
    
    await Promise.all(modelPromises);
    console.log(`Successfully created ${NUM_MODELS} marketplace models!`);
    
    // List all models
    const allModels = await AIModel.find({}).populate('owner', 'profile.name');
    console.log("\nAll models in database:");
    allModels.forEach(model => {
      console.log(`- ${model.name} (Owner: ${model.owner.profile.name}, Published: ${model.isPublished})`);
    });
    
    console.log("\nMarketplace model generation complete!");
  } catch (error) {
    console.error("Error creating marketplace models:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the generator
createMarketplaceModels(); 