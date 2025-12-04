import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  friendId: { type: mongoose.Schema.Types.ObjectId, ref: "Friend" },
  amount: Number,
  type: { type: String, enum: ["lend", "borrow"] },
  datetime: Date,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Expense", expenseSchema);
