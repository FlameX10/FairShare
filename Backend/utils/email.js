import emailjs from "@emailjs/nodejs";

emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});

export const sendOTPEmail = async (email, otp) => {
  try {
    console.log(`[EMAIL] Sending OTP to ${email}`);

    const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString();

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        email: email,         // matches {{email}}
        passcode: otp,        // matches {{passcode}}
        time: expiryTime,     // matches {{time}}
        company: "FairShare"  // matches {{company}}
      }
    );

    console.log(`[EMAIL] OTP sent successfully to ${email}`);
    return true;

  } catch (error) {
    console.error(`[EMAIL ERROR] ${error.message}`);
    return false;
  }
};
