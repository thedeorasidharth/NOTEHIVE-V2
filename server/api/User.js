const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Otp = require('../models/Otp'); // yeh import karo
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// 📩 SIGNUP
router.post('/signup', upload.single('profileImage'), async (req, res) => {
  let { firstName, lastName, bio, mobile, email, password, dob } = req.body;

  firstName = firstName?.trim();
  lastName = lastName?.trim();
  bio = bio?.trim();
  mobile = mobile?.trim();
  email = email?.trim();
  password = password?.trim();
  dob = dob?.trim();

  if (!firstName || !lastName || !bio || !mobile || !email || !password || !dob) {
    return res.json({ status: "FAILED", message: "EMPTY INPUT FIELDS" });
  }

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
    return res.json({ status: "FAILED", message: "INVALID EMAIL" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ status: "FAILED", message: "USER ALREADY EXISTS" });
    }

    const uploadedImage = await uploadToCloudinary(req.file.buffer);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await new User({
      firstName,
      lastName,
      bio,
      mobile,
      email,
      password: hashedPassword,
      dob,
      profileImage: uploadedImage.secure_url,
    }).save();

    console.log('Signup values:', { firstName, lastName, bio, mobile, email, password, dob });

    // OTP generate karo
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Save OTP with purpose = account_verification
    await new Otp({ userId: newUser._id, otp, purpose: 'account_verification' }).save();

    // Send OTP via email
    await sendEmail(email, "Verify Your Email (OTP)", `Your OTP is: ${otp}`);
    res.json({
      status: "PENDING",
      message: "OTP sent to email",
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        bio: newUser.bio,
        mobile: newUser.mobile,
        dob: newUser.dob,
        profileImage: uploadedImage.secure_url
      }
    });
    
    

  } catch (err) {
    console.error(err);
    res.json({ status: "FAILED", message: "SERVER ERROR" });
  }
});



// ✅ VERIFY OTP (for account verification)
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.json({ status: "FAILED", message: "EMPTY INPUT FIELDS" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "FAILED", message: "USER NOT FOUND" });
    }

    const userOtpRecord = await Otp.findOne({ 
      userId: user._id, 
      otp, 
      purpose: 'account_verification' 
    });

    if (!userOtpRecord) {
      return res.json({ status: "FAILED", message: "INVALID OR EXPIRED OTP" });
    }

    user.isVerified = true;
    await user.save();

    await Otp.deleteOne({ _id: userOtpRecord._id });

    res.json({ status: "SUCCESS", message: "Email verified successfully" });

  } catch (err) {
    console.error(err);
    res.json({ status: "FAILED", message: "SERVER ERROR" });
  }
});



//  LOGIN
const jwt = require("jsonwebtoken");
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();

    console.log('🟢 Login attempt with:', { email });

    if (!email || !password) {
      return res.status(400).json({ status: "FAILED", message: "Email and Password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: "FAILED", message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "FAILED", message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ status: "FAILED", message: "Please verify your email before logging in." });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    console.log("JWT_SECRET used for token generation:", JWT_SECRET);

    if (!JWT_SECRET) {
      return res.status(500).json({ status: "FAILED", message: "Server configuration error: JWT_SECRET not set" });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log('✅ LOGIN SUCCESSFUL');

    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      profileImage: user.profileImage || null,
      bio: user.bio || "",
      dob: user.dob || null,
      phone: user.phone || "",
      totalUploads: user.totalUploads || 0,
      totalDownloads: user.totalDownloads || 0,
    };

    return res.status(200).json({
      status: "SUCCESS",
      message: "Login successful.",
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('🔥 SERVER ERROR:', err);
    return res.status(500).json({ status: "FAILED", message: "Server error." });
  }
});

// ✅ FORGOT PASSWORD (Send OTP for password reset)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received email:", email);

    if (!email) {
      return res.status(400).json({
        status: "FAILED",
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        status: "PENDING",
        message: "If account exists, OTP will be sent"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);

    await Otp.findOneAndUpdate(
      { userId: user._id, purpose: "password_reset" },
      { otp, createdAt: new Date() },
      { upsert: true }
    );

    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);
    console.log("Email sent successfully");

    res.json({
      status: "PENDING",
      message: "OTP sent to email"
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      status: "FAILED",
      message: "Server error"
    });
  }
});

// ✅ VERIFY RESET OTP (Separate from account verification)
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        status: "FAILED", 
        message: "User not found" 
      });
    }

    const otpRecord = await Otp.findOne({ 
      userId: user._id, 
      otp,
      purpose: "password_reset" 
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        status: "FAILED", 
        message: "Invalid OTP" 
      });
    }

    res.json({ 
      status: "SUCCESS", 
      message: "OTP verified" 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: "FAILED", 
      message: "Server error" 
    });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ 
        status: "FAILED", 
        message: "User not found" 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { _id: user._id },
      { password: hashedPassword }
    );

    await Otp.deleteMany({ userId: user._id });

    res.json({ 
      status: "SUCCESS", 
      message: "Password updated" 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: "FAILED", 
      message: "Server error" 
    });
  }
});


module.exports = router;
