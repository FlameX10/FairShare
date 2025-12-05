import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  socketTimeout: 30000,
  pool: {
    maxConnections: 1,
    maxMessages: 5,
    rateDelta: 4000,
    rateLimit: 14,
  },
});
