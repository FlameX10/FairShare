import UpiRequest from "../models/UpiRequest.js";

export const sendUpiReq = async (req, res) => {
  const { friendId, amount, note } = req.body;

  try {
    const reqData = await UpiRequest.create({
      fromUserId: req.user.id,
      toFriendId: friendId,
      amount,
      note,
    });

    res.json({ message: "UPI Request Created", reqData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpiRequests = async (req, res) => {
  try {
    const requests = await UpiRequest.find({
      $or: [
        { fromUserId: req.user.id },
        { toFriendId: req.user.id },
      ],
    })
      .populate("fromUserId", "name email")
      .populate("toFriendId", "name upiId")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
