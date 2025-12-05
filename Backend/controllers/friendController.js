import Friend from "../models/Friend.js";

export const addFriend = async (req, res) => {
  const { name, upiId } = req.body;

  const friend = await Friend.create({
    ownerId: req.user.id,
    name,
    upiId,
  });

  res.json(friend);
};

export const getFriends = async (req, res) => {
  const friends = await Friend.find({ ownerId: req.user.id });
  res.json(friends);
};

export const updateFriendUpiId = async (req, res) => {
  try {
    const { friendId } = req.params;
    const { upiId } = req.body;

    if (!upiId) {
      return res.status(400).json({ message: "UPI ID is required" });
    }

    const friend = await Friend.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Check if user owns this friend
    if (friend.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this friend" });
    }

    friend.upiId = upiId;
    await friend.save();

    res.json({ message: "UPI ID updated successfully", friend });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
