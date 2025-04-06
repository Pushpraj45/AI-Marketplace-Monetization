const mongoose = require("mongoose");

const ModelAnalyticsSchema = new mongoose.Schema(
  {
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIModel",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    interactions: {
      type: Number,
      default: 0,
    },
    tokens: {
      input: {
        type: Number,
        default: 0,
      },
      output: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      }
    },
    revenue: {
      type: Number,
      default: 0,
    },
    uniqueUsers: {
      type: Number,
      default: 0,
    },
    responseTime: {
      average: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      }
    },
    geographicDistribution: {
      type: Map,
      of: Number,
      default: {},
    }
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient querying
ModelAnalyticsSchema.index({ modelId: 1, date: 1 });

module.exports = mongoose.model("ModelAnalytics", ModelAnalyticsSchema); 