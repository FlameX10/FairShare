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
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/upi", upiRoutes);
app.use("/api/pdf", pdfRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
