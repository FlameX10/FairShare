import express from "express";
import { sendUpiReq } from "../controllers/upiController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", auth, sendUpiReq);

export default router;
