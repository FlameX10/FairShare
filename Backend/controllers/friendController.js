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
