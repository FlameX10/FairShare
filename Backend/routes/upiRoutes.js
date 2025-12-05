import express from "express";
import { sendUpiReq, getUpiRequests } from "../controllers/upiController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", auth, sendUpiReq);
router.get("/list", auth, getUpiRequests);

export default router;
