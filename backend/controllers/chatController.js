const { chatWithBot } = require('../advanced-chat-service');
const UserTokens = require('../models/UserTokens');
const AIModel = require('../models/AIModel');
const ModelAnalytics = require('../models/ModelAnalytics');

/**
 * @desc    Chat with Azure OpenAI model
 * @route   POST /api/chat
 * @access  Private
 */
const chatWithModel = async (req, res) => {
  try {
    const { message, modelId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Skip token check for public route
    if (!req.user) {
      const response = await chatWithBot(message);
      return res.status(200).json({
        success: true,
        data: { response }
      });
    }

    // Check if the model exists if modelId is provided
    let model = null;
    if (modelId) {
      model = await AIModel.findById(modelId);
      if (!model) {
        return res.status(404).json({ 
          success: false, 
          error: 'Model not found' 
        });
      }
    }

    // Check if user has enough tokens and deduct tokens
    let userTokens = await UserTokens.findOne({ userId: req.user._id });
    
    if (!userTokens) {
      userTokens = new UserTokens({
        userId: req.user._id,
      });
      await userTokens.save();
    }

    const tokenCost = 500; // Each chat costs 500 tokens

    if (userTokens.balance < tokenCost) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient token balance',
        balance: userTokens.balance,
        required: tokenCost
      });
    }

    // Get the start time to calculate response time
    const startTime = Date.now();
    
    // Process the chat request
    const response = await chatWithBot(message);
    
    // Calculate response time in milliseconds
    const responseTime = Date.now() - startTime;
    
    // Deduct tokens and update history
    userTokens.balance -= tokenCost;
    userTokens.totalUsed += tokenCost;
    
    // Add to history
    userTokens.history.push({
      action: 'debit',
      amount: tokenCost,
      description: model ? `Chat with ${model.name}` : 'Chat with AI',
      modelId: model ? model._id : null,
      timestamp: new Date(),
    });

    // Update model interactions if modelId is provided
    if (modelId) {
      const modelInteractionIndex = userTokens.modelInteractions.findIndex(
        (interaction) => interaction.modelId && interaction.modelId.toString() === modelId
      );

      if (modelInteractionIndex === -1) {
        // First interaction with this model
        userTokens.modelInteractions.push({
          modelId,
          interactions: 1,
          tokensUsed: tokenCost,
          lastInteraction: new Date(),
        });
      } else {
        // Update existing interaction
        userTokens.modelInteractions[modelInteractionIndex].interactions += 1;
        userTokens.modelInteractions[modelInteractionIndex].tokensUsed += tokenCost;
        userTokens.modelInteractions[modelInteractionIndex].lastInteraction = new Date();
      }
      
      // Record analytics data for this model interaction
      await recordModelAnalytics({
        modelId,
        inputTokens: Math.round(tokenCost * 0.3), // Approximate split of tokens
        outputTokens: Math.round(tokenCost * 0.7),
        totalTokens: tokenCost,
        responseTime,
        userId: req.user._id,
        country: req.headers['x-country-code'] || 'US' // Use header if available or default
      });
    }

    // Save token changes
    await userTokens.save();
    console.log(`Tokens deducted for user ${req.user._id}. New balance: ${userTokens.balance}`);
    
    res.status(200).json({
      success: true,
      data: { 
        response,
        tokenBalance: userTokens.balance,
        tokensUsed: tokenCost
      }
    });
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your request'
    });
  }
};

/**
 * @desc    Get chat history for a user
 * @route   GET /api/chat/history
 * @access  Private
 */
const getChatHistory = async (req, res) => {
  try {
    // Placeholder for actual implementation
    // In a real implementation, this would fetch chat history from a database
    res.status(200).json({
      success: true,
      data: {
        history: []
      }
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while retrieving chat history'
    });
  }
};

/**
 * @desc    Get user token balance
 * @route   GET /api/chat/tokens
 * @access  Private
 */
const getTokenBalance = async (req, res) => {
  try {
    const userTokens = await UserTokens.findOne({ userId: req.user._id });
    
    if (!userTokens) {
      // Create new token record if not exists
      const newUserTokens = new UserTokens({
        userId: req.user._id,
      });
      await newUserTokens.save();
      
      return res.status(200).json({
        success: true,
        data: {
          balance: newUserTokens.balance,
          totalUsed: newUserTokens.totalUsed
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        balance: userTokens.balance,
        totalUsed: userTokens.totalUsed
      }
    });
  } catch (error) {
    console.error('Error getting token balance:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while retrieving token balance'
    });
  }
};

/**
 * Records model usage analytics for real user interactions
 * @param {Object} data - Analytics data to record
 */
const recordModelAnalytics = async (data) => {
  try {
    const { 
      modelId, 
      inputTokens = 0, 
      outputTokens = 0, 
      totalTokens = 0, 
      responseTime = 0,
      userId,
      country = 'US'
    } = data;
    
    // Calculate revenue based on token usage (example rate: $0.02 per 1K tokens)
    const revenue = totalTokens * 0.00002;

    // Find today's analytics record or create a new one
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    
    let analyticsRecord = await ModelAnalytics.findOne({
      modelId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // End of day
      }
    });
    
    if (!analyticsRecord) {
      // Create new record for today
      analyticsRecord = new ModelAnalytics({
        modelId,
        date: today,
        interactions: 1,
        tokens: {
          input: inputTokens,
          output: outputTokens,
          total: totalTokens
        },
        revenue,
        uniqueUsers: 1, // Start with 1 user
        responseTime: {
          average: responseTime,
          max: responseTime
        },
        geographicDistribution: {
          [country]: 1
        }
      });
      
      // Track unique users in a Set-like structure
      analyticsRecord._uniqueUserIds = [userId.toString()];
    } else {
      // Update existing record
      analyticsRecord.interactions += 1;
      analyticsRecord.tokens.input += inputTokens;
      analyticsRecord.tokens.output += outputTokens;
      analyticsRecord.tokens.total += totalTokens;
      analyticsRecord.revenue += revenue;
      
      // Update response time metrics
      const totalResponseTime = analyticsRecord.responseTime.average * (analyticsRecord.interactions - 1) + responseTime;
      analyticsRecord.responseTime.average = totalResponseTime / analyticsRecord.interactions;
      analyticsRecord.responseTime.max = Math.max(analyticsRecord.responseTime.max, responseTime);
      
      // Track unique users
      if (!analyticsRecord._uniqueUserIds) {
        analyticsRecord._uniqueUserIds = [];
      }
      
      if (!analyticsRecord._uniqueUserIds.includes(userId.toString())) {
        analyticsRecord._uniqueUserIds.push(userId.toString());
        analyticsRecord.uniqueUsers += 1;
      }
      
      // Update geographic distribution
      const currentCountryCount = analyticsRecord.geographicDistribution.get(country) || 0;
      analyticsRecord.geographicDistribution.set(country, currentCountryCount + 1);
    }
    
    await analyticsRecord.save();
    console.log(`Analytics recorded for model ${modelId}`);
    
  } catch (error) {
    console.error('Error recording model analytics:', error);
  }
};

module.exports = {
  chatWithModel,
  getChatHistory,
  getTokenBalance,
  recordModelAnalytics // Export for testing or direct use
}; 