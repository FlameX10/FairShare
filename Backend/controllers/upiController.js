import UpiRequest from "../models/UpiRequest.js";

export const sendUpiReq = async (req, res) => {
  const { friendId, amount, note } = req.body;

  const reqData = await UpiRequest.create({
    fromUserId: req.user.id,
    toFriendId: friendId,
    amount,
    note,
  });

  res.json({ message: "UPI Request Created", reqData });
};
