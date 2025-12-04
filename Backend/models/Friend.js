import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  upiId: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Friend", friendSchema);
