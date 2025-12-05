import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  friendId: { type: mongoose.Schema.Types.ObjectId, ref: "Friend" },
  amount: Number,
  type: { type: String, enum: ["lend", "borrow"], default: "lend" },
  description: String,
  datetime: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Expense", expenseSchema);
