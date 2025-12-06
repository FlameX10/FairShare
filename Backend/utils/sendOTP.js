import { transporter } from "./email.js";

export const sendOTP = async (email, otp) => {
  try {
    if (!email || !otp) {
      console.error("[OTP] Missing email or otp");
      return false;
    }

    console.log(`[OTP] Sending OTP to ${email}`);

    const mailOptions = {
      from: process.env.MAIL_FROM || "no-reply@fairshare.io",
      to: email,
      subject: "Your FairShare OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #2563eb;">Welcome to FairShare 🎉</h2>
          <p>Your OTP verification code:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; margin: 0; letter-spacing: 3px;">${otp}</h1>
          </div>
          <p style="color: #666;">This code expires in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    };

    // Send with timeout
    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email send timeout")), 8000)
      ),
    ]);

    console.log(`[OTP] Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("[OTP ERROR]", error.message);
    return false;
  }
};
