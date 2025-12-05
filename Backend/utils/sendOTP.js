// import { transporter } from "./email.js";

// export const sendOTP = async (email, otp) => {
//   try {
//     // Skip email in dev/testing
//     if (process.env.SEND_REAL_EMAIL === "false") {
//       console.log("Fake OTP (email skipped):", otp);
//       return true;
//     }

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,   // must match Gmail login (IMPORTANT)
//       to: email,
//       subject: "Your OTP",
//       html: `<h2>Your OTP is: ${otp}</h2>`
//     });

//     return true;

//   } catch (err) {
//     console.error("Email Error:", err);
//     return false;
//   }
// };



import { transporter } from "./email.js";

export const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP",
      html: `<h2>Your OTP is: ${otp}</h2>`
    });
    return true;
  } catch (err) {
    console.log("Email Error:", err);
    return false;
  }
};

