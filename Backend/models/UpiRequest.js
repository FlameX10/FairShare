import mongoose from "mongoose";

const upiRequestSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  toFriendId: { type: mongoose.Schema.Types.ObjectId, ref: "Friend" },
  amount: Number,
  note: String,
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("UpiRequest", upiRequestSchema);
