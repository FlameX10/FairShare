import { sendOTPEmail } from "./email.js";

export const sendOTP = async (email, otp) => {
  try {
    if (!email || !otp) {
      console.error("[OTP] Missing email or otp");
      return false;
    }

    const result = await sendOTPEmail(email, otp);
    return result;
  } catch (error) {
    console.error("[OTP ERROR]", error.message);
    return false;
  }
};
