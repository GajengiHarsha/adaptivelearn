const express = require('express');
const router = express.Router();
const { signup, login, googleLogin } = require('../controllers/authController'); // Import googleLogin
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming you have a User model
const Token = require('../models/Token'); // Token model for password reset tokens
const schedule = require('node-schedule');

// Schedule a job to clean up expired tokens every hour
schedule.scheduleJob('0 * * * *', async () => {
  try {
    await Token.deleteMany({ expiresAt: { $lt: Date.now() } });
    console.log('✅ Expired tokens cleaned up');
  } catch (error) {
    console.error('❌ Error cleaning up expired tokens:', error);
  }
});

// Define routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin); // Add Google login route

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your App Password
  },
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await Token.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    const resetUrl = `http://localhost:5000/reset-password.html?token=${resetToken}&id=${user._id}`;
    const mailOptions = {
      from: 'no-reply@adaptivelearn.com',
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again later.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, userId, newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await Token.findOne({ userId, token: hashedToken, expiresAt: { $gt: Date.now() } });

    if (!resetToken) return res.status(400).json({ error: 'Invalid or expired token.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    await resetToken.deleteOne();
    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again later.' });
  }
});

module.exports = router; // Export the router
