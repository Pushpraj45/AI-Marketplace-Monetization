const AIModel = require("../models/AIModel");
const User = require("../models/User");

// Get all models published in the marketplace
exports.getMarketplaceModels = async (req, res) => {
  try {
    const models = await AIModel.find({ 
      status: "active", 
      isPublished: true 
    })
    .populate("owner", "profile.name profile.organization")
    .select("-firstMessage"); // Don't send the prompt to clients

    res.status(200).json({ success: true, data: models });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single model by ID (for marketplace view)
exports.getMarketplaceModelById = async (req, res) => {
  try {
    const model = await AIModel.findOne({ 
      _id: req.params.id, 
      status: "active",
      isPublished: true
    })
    .populate("owner", "profile.name profile.organization");

    if (!model) {
      return res.status(404).json({ success: false, error: "Model not found" });
    }

    res.status(200).json({ success: true, data: model });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get models owned by the current developer
exports.getDeveloperModels = async (req, res) => {
  try {
    const models = await AIModel.find({ owner: req.user.id })
                               .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: models });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single model by ID (for developer editing)
exports.getDeveloperModelById = async (req, res) => {
  try {
    const model = await AIModel.findOne({ 
      _id: req.params.id,
      owner: req.user.id
    });

    if (!model) {
      return res.status(404).json({ success: false, error: "Model not found or you don't have access" });
    }

    res.status(200).json({ success: true, data: model });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new model
exports.createModel = async (req, res) => {
  try {
    // Check if user is a developer
    if (req.user.role !== "developer") {
      return res.status(403).json({ 
        success: false, 
        error: "Only developers can create models" 
      });
    }

    const model = await AIModel.create({
      ...req.body,
      owner: req.user.id,
      status: "draft"
    });

    res.status(201).json({ success: true, data: model });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a model
exports.updateModel = async (req, res) => {
  try {
    const model = await AIModel.findOne({ 
      _id: req.params.id,
      owner: req.user.id
    });

    if (!model) {
      return res.status(404).json({ 
        success: false, 
        error: "Model not found or you don't have access" 
      });
    }

    // Don't allow updating certain fields directly
    delete req.body.owner;
    delete req.body.stats;
    delete req.body.status;
    delete req.body.publishedAt;

    // Update model
    const updatedModel = await AIModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedModel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Submit model for publishing (changes status to active directly)
exports.submitForPublishing = async (req, res) => {
  try {
    const model = await AIModel.findOne({ 
      _id: req.params.id,
      owner: req.user.id
    });

    if (!model) {
      return res.status(404).json({ 
        success: false, 
        error: "Model not found or you don't have access" 
      });
    }

    // Check if model has all required fields
    if (!model.name || !model.description || !model.firstMessage) {
      return res.status(400).json({
        success: false,
        error: "Model must have name, description, and first message before publishing"
      });
    }

    // Update status to active directly (skip pending-approval)
    model.status = "active";
    model.isPublished = true;
    model.publishedAt = Date.now(); // Set publish date
    await model.save();

    res.status(200).json({ success: true, data: model });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Approve a model for publishing (admin only)
exports.approveModel = async (req, res) => {
  try {
    const model = await AIModel.findById(req.params.id);

    if (!model) {
      return res.status(404).json({ success: false, error: "Model not found" });
    }

    // Update status to active and set publish date
    model.status = "active";
    model.publishedAt = Date.now();
    await model.save();

    res.status(200).json({ success: true, data: model });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a model
exports.deleteModel = async (req, res) => {
  try {
    const model = await AIModel.findOne({ 
      _id: req.params.id,
      owner: req.user.id
    });

    if (!model) {
      return res.status(404).json({ 
        success: false, 
        error: "Model not found or you don't have access" 
      });
    }

    await model.deleteOne();
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 