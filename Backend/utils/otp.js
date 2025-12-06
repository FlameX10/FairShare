import OTP from "../models/OTP.js";
import { sendOTPEmail } from "./email.js";

export const generateOTP = async (userId, email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const expiryTime = expiresAt.toLocaleTimeString();

  await OTP.create({
    userId,
    otp,
    purpose: "first_login",
    expiresAt,
  });

  await sendOTPEmail(email, otp, expiryTime);
  return otp;
};
