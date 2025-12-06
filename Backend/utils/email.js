import emailjs from "@emailjs/nodejs";

// Initialize EmailJS
try {
  emailjs.init({
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
  });
  console.log("[EMAIL] EmailJS initialized successfully");
} catch (error) {
  console.error("[EMAIL] EmailJS initialization error:", error.message);
}

export const sendOTPEmail = async (email, otp) => {
  try {
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID) {
      console.error("[EMAIL] Missing EmailJS credentials");
      return false;
    }

    console.log(`[EMAIL] Sending OTP to ${email}`);

    const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString();

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        email: email,
        passcode: otp,
        time: expiryTime,
        company: "FairShare",
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log(`[EMAIL] OTP sent successfully to ${email}`, response.status);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR]`, error);
    return false;
  }
};
