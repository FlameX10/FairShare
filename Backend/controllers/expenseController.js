import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  const { friendId, amount, type, datetime, description } = req.body;

  const expense = await Expense.create({
    ownerId: req.user.id,
    friendId,
    amount,
    type,
    datetime,
    description,
  });

  res.json(expense);
};

export const getFriendExpenses = async (req, res) => {
  const { friendId } = req.params;

  const expenses = await Expense.find({
    ownerId: req.user.id,
    friendId,
  });

  res.json(expenses);
};
