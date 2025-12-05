import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return false;
    }

    console.log(`[EMAIL] Sending OTP to ${email}`);

    const result = await resend.emails.send({
      from: "FairShare <onboarding@resend.dev>",
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
    });

    if (result.error) {
      console.error(`[EMAIL ERROR] ${result.error.message}`);
      return false;
    }

    console.log(`[EMAIL] OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] ${error.message}`);
    return false;
  }
};
