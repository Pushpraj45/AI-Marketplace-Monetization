const User = require("../models/User");
const Token = require("../models/Token");
const sendgrid = require("../config/sendgrid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    user = new User({
      email,
      password,
      role: role || "user", // Default to 'user' if not specified
      profile: profile || {},
      isVerified: true, // Set to true by default for development
    });

    await user.save();

    // DISABLED FOR DEVELOPMENT: Email verification
    /* 
    // Generate verification token
    const verificationToken = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
      type: "verification",
    });

    await verificationToken.save();

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken.token}`;
    await sendgrid.sendVerificationEmail(user.email, verificationLink);
    */

    res.status(201).json({
      success: true,
      message: "Registration successful! Your account is ready to use.", // Modified message
      userId: user._id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

/**
 * @desc    Verify user email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find the verification token
    const verificationToken = await Token.findOne({
      token,
      type: "verification",
    });

    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Find and verify the user
    const user = await User.findById(verificationToken.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      await Token.findByIdAndDelete(verificationToken._id);
      return res.status(400).json({
        success: false,
        message: "Email already verified. Please login.",
      });
    }

    // Update user to verified
    user.isVerified = true;
    await user.save();

    // Delete the verification token
    await Token.findByIdAndDelete(verificationToken._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during email verification",
      error: error.message,
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // DISABLED FOR DEVELOPMENT: Email verification check
    /*
    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }
    */

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Delete any existing password reset tokens for this user
    await Token.deleteMany({
      userId: user._id,
      type: "password-reset",
    });

    // Create new password reset token
    const resetToken = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
      type: "password-reset",
    });

    await resetToken.save();

    // DISABLED FOR DEVELOPMENT: Email sending
    /*
    // Send password reset email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken.token}`;
    await sendgrid.sendPasswordResetEmail(user.email, resetLink);
    */

    // For development purposes: include the token directly in the response
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken.token}`;

    res.status(200).json({
      success: true,
      message: "Password reset link has been created",
      // Include reset link directly in response for development
      resetLink: resetLink,
      resetToken: resetToken.token,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing password reset request",
      error: error.message,
    });
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find the reset token
    const resetToken = await Token.findOne({
      token,
      type: "password-reset",
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    // Find user
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Update password
    user.password = password;
    await user.save();

    // Delete the reset token
    await Token.findByIdAndDelete(resetToken._id);

    res.status(200).json({
      success: true,
      message:
        "Password has been reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while resetting password",
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user data",
      error: error.message,
    });
  }
};
