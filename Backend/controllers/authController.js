import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/sendOTP.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash: hash,
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB
    await OTP.create({
      userId: user._id,
      otp,
      purpose: "first_login",
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    });

    // Send OTP email
    const emailSent = await sendOTP(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        error: "Failed to send OTP email. Please try again."
      });
    }

    res.json({ message: "User registered, OTP sent to email" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Validate OTP
    const dbOtp = await OTP.findOne({
      userId: user._id,
      otp,
      purpose: "first_login",
    });

    if (!dbOtp) return res.status(400).json({ message: "Invalid OTP" });

    // Mark user verified
    user.isEmailVerified = true;
    await user.save();

    // Remove OTPs
    await OTP.deleteMany({ userId: user._id });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
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
