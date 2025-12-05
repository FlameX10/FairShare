import express from "express";
import { addExpense, deleteExpense, getFriendExpenses, getAllExpenses, getExpenseSummary } from "../controllers/expenseController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", auth, addExpense);
router.delete("/:expenseId", auth, deleteExpense);
router.get("/list", auth, getAllExpenses);
router.get("/summary", auth, getExpenseSummary);
router.get("/:friendId", auth, getFriendExpenses);

export default router;
