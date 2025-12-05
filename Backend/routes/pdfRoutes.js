import express from "express";
import { generatePDF } from "../controllers/pdfController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", auth, generatePDF);

export default router;
