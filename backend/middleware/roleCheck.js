/**
 * Middleware to check if user has the required roles
 * @param {Array} allowedRoles - Array of roles that have access
 * @returns {Function} Middleware function
 */
module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // If no specific roles are required or user's role is in the allowed roles
    if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
      return next();
    }

    // User doesn't have the required role
    return res.status(403).json({
      success: false,
      message: "Access forbidden - You do not have the required role",
    });
  };
};
