import { transporter } from "./email.js";

export const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP",
    html: `<h2>Your OTP is: ${otp}</h2>`
  });
};
