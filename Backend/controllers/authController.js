import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/sendOTP.js";
import { generateToken } from "../utils/jwt.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Register request received with email:", email);

    // 0️⃣ Validate inputs
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // 1️⃣ Check if email exists
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // 2️⃣ Hash password
    const hash = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hash,
      isEmailVerified: false,
    });

    console.log("User created:", user._id);

    // 4️⃣ Create OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({
      userId: user._id,
      otp,
      purpose: "first_login",
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    });

    console.log("OTP created for user:", user._id);

    // 5️⃣ Send OTP
    console.log("About to send OTP to email:", email);
    const emailSent = await sendOTP(email, otp);
    console.log("Email sent result:", emailSent, "for email:", email);

    if (!emailSent) {
      console.error("Failed to send email to:", email);
      return res.status(500).json({
        success: false,
        error: "Failed to send OTP email. Check email configuration.",
      });
    }

    // 6️⃣ Final response
    return res.status(201).json({
      success: true,
      message: "OTP sent successfully to your email",
      email,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    console.error("Full error:", error);
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
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    // Validate OTP
    const dbOtp = await OTP.findOne({
      userId: user._id,
      otp,
      purpose: "first_login",
    });

    if (!dbOtp) return res.status(400).json({ success: false, message: "Invalid OTP" });

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
