import emailjs from "@emailjs/nodejs";

export const sendOTPEmail = async (email, otp) => {
  try {
    console.log(`[EMAIL] Sending OTP to ${email}`);

    const expiryTime = new Date(Date.now() + 15 * 60 * 1000)
      .toLocaleTimeString();

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

    console.log("[EMAIL] OTP sent successfully");
    return true;
    
  } catch (error) {
    console.error("[EMAIL ERROR RAW]", error);
    return false;
  }
};
