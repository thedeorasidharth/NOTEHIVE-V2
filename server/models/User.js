// Models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bio: { type: String },
  mobile: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date },
  profileImage: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notes" }], // Add this
});

module.exports = mongoose.model('User', UserSchema);