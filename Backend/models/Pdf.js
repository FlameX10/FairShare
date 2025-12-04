import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  friendId: { type: mongoose.Schema.Types.ObjectId, ref: "Friend" },
  fileName: String,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Pdf", pdfSchema);
