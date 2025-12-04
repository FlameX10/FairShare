import express from "express";
import { addExpense, getFriendExpenses } from "../controllers/expenseController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", auth, addExpense);
router.get("/:friendId", auth, getFriendExpenses);

export default router;
