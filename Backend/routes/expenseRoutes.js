import express from "express";
import { addExpense, getFriendExpenses, getAllExpenses, getExpenseSummary } from "../controllers/expenseController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", auth, addExpense);
router.get("/list", auth, getAllExpenses);
router.get("/summary", auth, getExpenseSummary);
router.get("/:friendId", auth, getFriendExpenses);

export default router;
