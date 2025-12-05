import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/sendOTP.js";
import { generateToken } from "../utils/jwt.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("[AUTH] Register request:", { name, email });

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Check if email exists
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hash,
      isEmailVerified: false,
    });

    console.log("[AUTH] User created:", user._id);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({
      userId: user._id,
      otp,
      purpose: "first_login",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    console.log("[AUTH] OTP created for user:", user._id);

    // Send OTP
    const emailSent = await sendOTP(email, otp);

    if (!emailSent) {
      // Still return success - user can request OTP again
      console.warn("[AUTH] OTP email failed but continuing...");
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. Check your email for OTP.",
      email,
    });
  } catch (error) {
    console.error("[AUTH ERROR]", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Registration failed",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    // Validate OTP
    const dbOtp = await OTP.findOne({
      userId: user._id,
      otp,
      purpose: "first_login",
    });

    if (!dbOtp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    // Mark user verified
    user.isEmailVerified = true;
    await user.save();

    // Remove OTPs
    await OTP.deleteMany({ userId: user._id });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
