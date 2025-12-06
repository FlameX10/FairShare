import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
  pool: {
    maxConnections: 1,
    maxMessages: 5,
    rateDelta: 4000,
    rateLimit: 14,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection with timeout
setTimeout(() => {
  transporter.verify((error, success) => {
    if (error) {
      console.error("[EMAIL] Transporter connection failed:", error.message);
    } else {
      console.log("[EMAIL] Transporter ready!");
    }
  });
}, 2000);
