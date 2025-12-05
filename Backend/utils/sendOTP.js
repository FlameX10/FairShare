import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {
  try {
    if (!email || !otp) {
      console.error("EMAIL ERROR: Email or OTP is missing");
      return false;
    }

    console.log("Sending OTP to:", email);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your FairShare OTP",
      html: `
        <h2>Welcome to FairShare! 🎉</h2>
        <p>Your OTP: <strong style="font-size: 24px; color: #2563eb;">${otp}</strong></p>
        <p>Valid for 10 minutes</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("EMAIL ERROR:", error.message);
    return false;
  }
};

