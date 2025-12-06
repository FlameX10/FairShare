import axios from "axios";

const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

export const sendOTPEmail = async (email, otp) => {
  try {
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY) {
      console.error("[EMAIL] Missing EmailJS credentials");
      return false;
    }

    console.log(`[EMAIL] Sending OTP to ${email}`);

    const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString();

    const payload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: email,
        passcode: otp,
        time: expiryTime,
        company: "FairShare",
      },
    };

    console.log("[EMAIL] Payload:", { ...payload, template_params: { ...payload.template_params, passcode: "***" } });

    const response = await axios.post(EMAILJS_API_URL, payload, { timeout: 10000 });

    console.log(`[EMAIL] OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Status:`, error.response?.status);
    console.error(`[EMAIL ERROR] Data:`, error.response?.data);
    console.error(`[EMAIL ERROR] Message:`, error.message);
    return false;
  }
};
