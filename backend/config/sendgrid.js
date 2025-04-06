const sgMail = require("@sendgrid/mail");

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send verification email
exports.sendVerificationEmail = async (to, verificationLink) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: "Verify Your Email - MonetizeAI",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Email Verification</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">Thank you for registering with MonetizeAI. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: center;">If you did not create an account, please ignore this email.</p>
      </div>
    `,
  };

  try {
    return await sgMail.send(msg);
  } catch (error) {
    console.error("SendGrid Error:", error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (to, resetLink) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: "Password Reset - MonetizeAI",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Password Reset</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">You have requested to reset your password. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: center;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      </div>
    `,
  };

  try {
    return await sgMail.send(msg);
  } catch (error) {
    console.error("SendGrid Error:", error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};
