const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP will expire after 5 minutes
  },
  purpose: {
    type: String,
    required: true,
    enum: ['account_verification', 'password_reset']
  }
});

module.exports = mongoose.model('Otp', otpSchema);
