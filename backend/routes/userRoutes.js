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
  searchUsers
} = require(
  "../controllers/userController"
);


router.get(
  "/search/:username",
  searchUsers
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