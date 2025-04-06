/**
 * Test script for verifying token deduction
 * 
 * This script tests:
 * 1. User token balance retrieval
 * 2. Chat with token deduction
 * 3. Check token balance after chat
 */

require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/User');
const UserTokens = require('../models/UserTokens');

const API_URL = 'http://localhost:5000/api';

// Test user credentials (should exist in the database)
const TEST_USER = {
  email: 'testuser@example.com',
  password: 'password123'
};

// Function to login and get token
const login = async () => {
  try {
    console.log(`Logging in as ${TEST_USER.email}...`);
    const response = await axios.post(`${API_URL}/auth/login`, TEST_USER);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw new Error('Login failed');
  }
};

// Function to get token balance
const getTokenBalance = async (token) => {
  try {
    console.log('Getting token balance...');
    const response = await axios.get(`${API_URL}/tokens`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error getting token balance:', error.response?.data || error.message);
    throw new Error('Failed to get token balance');
  }
};

// Function to send a chat message
const sendChatMessage = async (token, message, modelId = null) => {
  try {
    console.log(`Sending chat message: "${message}"`);
    const payload = { message };
    if (modelId) {
      payload.modelId = modelId;
    }
    
    const response = await axios.post(`${API_URL}/chat`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error.response?.data || error.message);
    throw new Error('Failed to send chat message');
  }
};

// Setup test user if not exists
const setupTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/monetizeai');
    console.log('Connected to MongoDB');
    
    // Check if test user exists
    let user = await User.findOne({ email: TEST_USER.email });
    if (!user) {
      console.log('Creating test user...');
      user = new User({
        email: TEST_USER.email,
        password: TEST_USER.password,
        role: 'user',
        isVerified: true
      });
      await user.save();
      console.log('Test user created');
    }
    
    // Check if user tokens exist
    let userTokens = await UserTokens.findOne({ userId: user._id });
    if (!userTokens) {
      console.log('Creating user tokens...');
      userTokens = new UserTokens({
        userId: user._id,
        balance: 10000,
        history: [
          {
            action: 'credit',
            amount: 10000,
            description: 'Initial token allocation'
          }
        ]
      });
      await userTokens.save();
      console.log('User tokens created with 10,000 initial tokens');
    } else {
      console.log(`User tokens exist with balance: ${userTokens.balance}`);
      
      // Reset to 10,000 tokens if needed
      if (userTokens.balance < 5000) {
        console.log('Resetting token balance to 10,000...');
        userTokens.balance = 10000;
        userTokens.history.push({
          action: 'credit',
          amount: 10000 - userTokens.balance,
          description: 'Token reset for testing'
        });
        await userTokens.save();
        console.log('Token balance reset to 10,000');
      }
    }
    
    return user._id;
  } catch (error) {
    console.error('Error setting up test user:', error);
    throw error;
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Main test function
const runTest = async () => {
  console.log('Starting token deduction test...');
  
  try {
    // Setup test user
    const userId = await setupTestUser();
    console.log(`Test user ID: ${userId}`);
    
    // Login and get token
    const token = await login();
    console.log('Login successful');
    
    // Get initial token balance
    const initialBalance = await getTokenBalance(token);
    console.log(`Initial token balance: ${initialBalance.balance}`);
    
    // Send a chat message
    const chatResponse = await sendChatMessage(token, 'Hello, how are you today?');
    console.log('Chat response received:', chatResponse.data.response);
    console.log(`New token balance: ${chatResponse.data.tokenBalance}`);
    
    // Verify token deduction
    const finalBalance = await getTokenBalance(token);
    console.log(`Final token balance from tokens API: ${finalBalance.balance}`);
    
    // Check if tokens were deducted correctly
    if (initialBalance.balance - finalBalance.balance === 500) {
      console.log('✓ Token deduction successful! 500 tokens were deducted.');
    } else {
      console.log(`✗ Token deduction verification failed! Expected deduction: 500, Actual: ${initialBalance.balance - finalBalance.balance}`);
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
runTest(); 