import express from "express";
import { generateFriendPDF } from "../controllers/pdfController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate/:friendId", auth, generateFriendPDF);

export default router;
