const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // Check for token in various places
    let token = 
      req.header("x-auth-token") || 
      req.header("authorization")?.replace('Bearer ', '') || 
      req.cookies?.token;

    // Log for debugging
    console.log("Auth middleware: Token received:", !!token);

    // Check if no token
    if (!token) {
      console.log("Auth middleware: No token provided");
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware: Token verified, user ID:", decoded.userId);

    // Find user by id
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("Auth middleware: User not found for ID:", decoded.userId);
      return res.status(401).json({
        success: false,
        message: "Token is valid, but user no longer exists",
      });
    }

    // Add user data to request
    req.user = user;
    req.user.role = decoded.role || user.role; // Ensure role is available from token or user object
    console.log("Auth middleware: User authenticated with role:", req.user.role);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};
