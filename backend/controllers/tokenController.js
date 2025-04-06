const UserTokens = require("../models/UserTokens");
const AIModel = require("../models/AIModel");

/**
 * @desc    Get user token balance and usage
 * @route   GET /api/tokens
 * @access  Private
 */
exports.getUserTokens = async (req, res) => {
  try {
    // Find or create user tokens record
    let userTokens = await UserTokens.findOne({ userId: req.user._id });
    
    if (!userTokens) {
      userTokens = await new UserTokens({
        userId: req.user._id,
      }).save();
    }

    res.status(200).json({
      success: true,
      data: {
        balance: userTokens.balance,
        totalUsed: userTokens.totalUsed,
      },
    });
  } catch (error) {
    console.error("Get user tokens error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching token information",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user token usage history
 * @route   GET /api/tokens/history
 * @access  Private
 */
exports.getTokenHistory = async (req, res) => {
  try {
    const userTokens = await UserTokens.findOne({ userId: req.user._id });

    if (!userTokens) {
      return res.status(404).json({
        success: false,
        message: "Token history not found",
      });
    }

    res.status(200).json({
      success: true,
      data: userTokens.history,
    });
  } catch (error) {
    console.error("Get token history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching token history",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user model interactions
 * @route   GET /api/tokens/models
 * @access  Private
 */
exports.getModelInteractions = async (req, res) => {
  try {
    const userTokens = await UserTokens.findOne({ userId: req.user._id })
      .populate({
        path: "modelInteractions.modelId",
        select: "name description icon",
      });

    if (!userTokens) {
      return res.status(404).json({
        success: false,
        message: "Model interactions not found",
      });
    }

    res.status(200).json({
      success: true,
      data: userTokens.modelInteractions,
    });
  } catch (error) {
    console.error("Get model interactions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching model interactions",
      error: error.message,
    });
  }
};

/**
 * @desc    Deduct tokens for model usage
 * @route   POST /api/tokens/deduct
 * @access  Private
 */
exports.deductTokens = async (req, res) => {
  try {
    const { modelId, amount = 500, description } = req.body;

    if (!modelId) {
      return res.status(400).json({
        success: false,
        message: "Model ID is required",
      });
    }

    // Check if model exists
    const model = await AIModel.findById(modelId);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    // Find or create user tokens record
    let userTokens = await UserTokens.findOne({ userId: req.user._id });
    
    if (!userTokens) {
      userTokens = await new UserTokens({
        userId: req.user._id,
      }).save();
    }

    // Check if user has enough tokens
    if (userTokens.balance < amount) {
      return res.status(403).json({
        success: false,
        message: "Insufficient token balance",
      });
    }

    // Update balance and history
    userTokens.balance -= amount;
    userTokens.totalUsed += amount;
    
    // Add to history
    userTokens.history.push({
      action: "debit",
      amount,
      description: description || `Used for ${model.name}`,
      modelId,
    });

    // Update model interactions
    const modelInteractionIndex = userTokens.modelInteractions.findIndex(
      (interaction) => interaction.modelId.toString() === modelId
    );

    if (modelInteractionIndex === -1) {
      // First interaction with this model
      userTokens.modelInteractions.push({
        modelId,
        interactions: 1,
        tokensUsed: amount,
        lastInteraction: new Date(),
      });
    } else {
      // Update existing interaction
      userTokens.modelInteractions[modelInteractionIndex].interactions += 1;
      userTokens.modelInteractions[modelInteractionIndex].tokensUsed += amount;
      userTokens.modelInteractions[modelInteractionIndex].lastInteraction = new Date();
    }

    await userTokens.save();

    res.status(200).json({
      success: true,
      data: {
        balance: userTokens.balance,
        deducted: amount,
      },
    });
  } catch (error) {
    console.error("Deduct tokens error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deducting tokens",
      error: error.message,
    });
  }
};

/**
 * @desc    Add tokens to user (for admin or purchase)
 * @route   POST /api/tokens/add
 * @access  Private/Admin
 */
exports.addTokens = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: "User ID and amount are required",
      });
    }

    // Only allow admins to add tokens to other users
    if (userId !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add tokens to other users",
      });
    }

    // Find or create user tokens record
    let userTokens = await UserTokens.findOne({ userId });
    
    if (!userTokens) {
      userTokens = await new UserTokens({
        userId,
      }).save();
    }

    // Update balance and history
    userTokens.balance += Number(amount);
    
    // Add to history
    userTokens.history.push({
      action: "credit",
      amount: Number(amount),
      description: description || "Token purchase or admin credit",
    });

    await userTokens.save();

    res.status(200).json({
      success: true,
      data: {
        balance: userTokens.balance,
        added: amount,
      },
    });
  } catch (error) {
    console.error("Add tokens error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding tokens",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user dashboard analytics
 * @route   GET /api/tokens/dashboard
 * @access  Private
 */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userTokens = await UserTokens.findOne({ userId: req.user._id })
      .populate({
        path: "modelInteractions.modelId",
        select: "name description icon",
      });

    if (!userTokens) {
      return res.status(404).json({
        success: false,
        message: "User token data not found",
      });
    }

    // Calculate recent transactions (last 5)
    const recentTransactions = userTokens.history
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    // Calculate most used models
    const mostUsedModels = [...userTokens.modelInteractions]
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        currentBalance: userTokens.balance,
        totalUsed: userTokens.totalUsed,
        totalModelsInteracted: userTokens.modelInteractions.length,
        totalInteractions: userTokens.modelInteractions.reduce(
          (total, model) => total + model.interactions, 0
        ),
        recentTransactions,
        mostUsedModels,
      },
    });
  } catch (error) {
    console.error("Get dashboard analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data",
      error: error.message,
    });
  }
}; 