import express from "express";
import { addFriend, getFriends, updateFriendUpiId } from "../controllers/friendController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", auth, addFriend);
router.get("/list", auth, getFriends);
router.patch("/:friendId/upi", auth, updateFriendUpiId);

export default router;
