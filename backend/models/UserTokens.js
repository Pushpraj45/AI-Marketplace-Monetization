const mongoose = require("mongoose");

const UserTokensSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 10000, // Initial token balance for new users
      min: 0,
    },
    totalUsed: {
      type: Number,
      default: 0,
    },
    modelInteractions: [
      {
        modelId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AIModel",
        },
        interactions: {
          type: Number,
          default: 0,
        },
        tokensUsed: {
          type: Number,
          default: 0,
        },
        lastInteraction: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    history: [
      {
        action: {
          type: String,
          enum: ["credit", "debit"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
        },
        modelId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AIModel",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create index for efficient querying
UserTokensSchema.index({ userId: 1 });

module.exports = mongoose.model("UserTokens", UserTokensSchema); 