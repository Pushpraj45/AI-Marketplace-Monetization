const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is valid, but user no longer exists",
      });
    }

    // Add user data to request
    req.user = user;
    req.user.role = decoded.role; // Ensure role is available from token
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};
