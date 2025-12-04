import Friend from "../models/Friend.js";
import Expense from "../models/Expense.js";
import Pdf from "../models/Pdf.js";
import { generatePDF } from "../utils/generatePDF.js";

export const generateFriendPDF = async (req, res) => {
  const { friendId } = req.params;

  const friend = await Friend.findById(friendId);
  const expenses = await Expense.find({ friendId, ownerId: req.user.id });

  const fileName = generatePDF(friend, expenses);

  const saved = await Pdf.create({
    ownerId: req.user.id,
    friendId,
    fileName,
    fileUrl: `/pdfs/${fileName}`,
  });

  res.json(saved);
};
