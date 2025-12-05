import Expense from "../models/Expense.js";
import Friend from "../models/Friend.js";

export const addExpense = async (req, res) => {
  try {
    const { friendId, amount, type, datetime, description } = req.body;

    if (!friendId || !amount || !description || !type) {
      return res.status(400).json({ message: "Missing required fields: friendId, amount, description, type" });
    }

    if (!["lend", "borrow"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'lend' or 'borrow'" });
    }

    const expense = await Expense.create({
      ownerId: req.user.id,
      friendId,
      amount: parseFloat(amount),
      type,
      datetime: datetime || new Date(),
      description,
    });

    res.json(expense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getFriendExpenses = async (req, res) => {
  try {
    const { friendId } = req.params;

    const expenses = await Expense.find({
      ownerId: req.user.id,
      friendId,
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ ownerId: req.user.id })
      .populate("friendId", "name upiId")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ ownerId: req.user.id })
      .populate("friendId", "name");

    let totalLent = 0; // Money user gave to friends
    let totalBorrowed = 0; // Money friends gave to user
    const friendBalances = {};

    expenses.forEach((expense) => {
      const friendName = expense.friendId?.name || "Unknown";
      const friendId = expense.friendId?._id;

      if (!friendBalances[friendId]) {
        friendBalances[friendId] = {
          friendId,
          friendName,
          lent: 0,
          borrowed: 0,
          balance: 0,
        };
      }

      if (expense.type === "lend") {
        totalLent += expense.amount;
        friendBalances[friendId].lent += expense.amount;
      } else if (expense.type === "borrow") {
        totalBorrowed += expense.amount;
        friendBalances[friendId].borrowed += expense.amount;
      }

      // Calculate balance: positive = friend owes you, negative = you owe friend
      friendBalances[friendId].balance = friendBalances[friendId].lent - friendBalances[friendId].borrowed;
    });

    const friendBalancesArray = Object.values(friendBalances);

    res.json({
      totalLent,
      totalBorrowed,
      netBalance: totalLent - totalBorrowed,
      friendBalances: friendBalancesArray,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
