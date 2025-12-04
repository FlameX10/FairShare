import express from "express";
import { addFriend, getFriends } from "../controllers/friendController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", auth, addFriend);
router.get("/", auth, getFriends);

export default router;
