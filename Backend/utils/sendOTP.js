import { transporter } from "./email.js";

export const sendOTP = async (email, otp) => {
  try {
    if (!email || !otp) {
      console.error("EMAIL ERROR: Email or OTP is missing");
      return false;
    }

    console.log("Sending OTP to:", email);

    // Send email with timeout
    const sendPromise = transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your FairShare OTP",
      text: `Your OTP is: ${otp}. Valid for 10 minutes.`,
      html: `<h2>Welcome to FairShare 🎉</h2><p>Your OTP: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`,
    });

    // Timeout after 20 seconds
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email send timeout")), 20000)
    );

    await Promise.race([sendPromise, timeoutPromise]);
    console.log("OTP sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("EMAIL ERROR:", error.message);
    return false;
  }
};
