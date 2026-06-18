const User = require("../models/User");

exports.getUser = async (req, res) => {
  const user = await User.findById(
    req.params.id
  ).select("-password");

  res.json(user);
};

exports.updateUser = async (
  req,
  res
) => {

  const {
    username,
    bio
  } = req.body;

  const updatedUser =
    await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        bio
      },
      {
        new: true
      }
    );

  res.json(updatedUser);
};

exports.followUser = async (req, res) => {
  const user =
    await User.findById(req.params.id);

  const currentUser =
    await User.findById(req.user._id);

  if (
    !user.followers.includes(
      currentUser._id
    )
  ) {
    user.followers.push(currentUser._id);

    currentUser.following.push(user._id);

    await user.save();
    await currentUser.save();

    res.json({
      message: "Followed",
    });
  }
};

exports.unfollowUser = async (
  req,
  res
) => {
  const user =
    await User.findById(req.params.id);

  const currentUser =
    await User.findById(req.user._id);

  user.followers =
    user.followers.filter(
      (id) =>
        id.toString() !==
        currentUser._id.toString()
    );

  currentUser.following =
    currentUser.following.filter(
      (id) =>
        id.toString() !== user._id.toString()
    );

  await user.save();
  await currentUser.save();

  res.json({
    message: "Unfollowed",
  });
};

exports.searchUsers = async (
  req,
  res
) => {

  try {

    const users =
      await User.find({
        username: {
          $regex:
            req.params.username,
          $options: "i"
        }
      })
      .select(
        "_id username email"
      );

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message:
        "Search Failed"
    });

  }
};