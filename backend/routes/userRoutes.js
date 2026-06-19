const router =
  require("express").Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  getUser,
  updateUser,
  followUser,
  unfollowUser,
  searchUsers,
  getFollowingUsers
} = require(
  "../controllers/userController"
);

router.get(
  "/search/:username",
  searchUsers
);

router.get(
  "/following/list",
  protect,
  getFollowingUsers
);

router.get("/:id", getUser);

router.put(
  "/:id",
  protect,
  updateUser
);

router.post(
  "/:id/follow",
  protect,
  followUser
);

router.post(
  "/:id/unfollow",
  protect,
  unfollowUser
);

module.exports = router;