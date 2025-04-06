const mongoose = require("mongoose");

const AIModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Model name is required"],
      trim: true,
      maxlength: [100, "Model name cannot be more than 100 characters"],
    },
    firstMessage: {
      type: String,
      required: [true, "First message is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    tags: {
      type: [String],
      default: [],
    },
    perTokenPricing: {
      enabled: {
        type: Boolean,
        default: false,
      },
      price: {
        type: Number,
        default: 0,
        min: [0, "Price cannot be negative"],
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending-approval", "active", "rejected"],
      default: "draft",
    },
    stats: {
      usageCount: {
        type: Number,
        default: 0,
      },
      revenue: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AIModel", AIModelSchema); 