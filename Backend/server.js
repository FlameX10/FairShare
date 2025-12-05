import "./config/dotenv.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import upiRoutes from "./routes/upiRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

const app = express();

// CORS middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://splitoo.netlify.app",
    "https://fairshare-frontend.netlify.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/upi", upiRoutes);
app.use("/api/pdf", pdfRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || "Server error" 
  });
});

// LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
