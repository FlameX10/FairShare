// import "./config/dotenv.js";
// import express from "express";
// import cors from "cors";
// import connectDB from "./config/db.js";

// import authRoutes from "./routes/authRoutes.js";
// import friendRoutes from "./routes/friendRoutes.js";
// import expenseRoutes from "./routes/expenseRoutes.js";
// import upiRoutes from "./routes/upiRoutes.js";
// import pdfRoutes from "./routes/pdfRoutes.js";

// const app = express();

// // CORS middleware
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.use(express.json());

// connectDB();

// app.use("/api/auth", authRoutes);
// app.use("/api/friends", friendRoutes);
// app.use("/api/expense", expenseRoutes);
// app.use("/api/upi", upiRoutes);
// app.use("/api/pdf", pdfRoutes);

// app.listen(5000, () => console.log("Server running on port 5000"));




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
    "http://localhost:3000",         // local development
    "https://splitoo.netlify.app"    // production frontend
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/upi", upiRoutes);
app.use("/api/pdf", pdfRoutes);

// Health endpoint
app.get("/", (req, res) => {
  res.send("Backend Running ✔");
});

// Dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
