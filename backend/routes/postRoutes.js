const router =
  require("express").Router();

const protect = require(
  "../middleware/authMiddleware"
);

const upload =
  require(
    "../middleware/uploadMiddleware"
  );

const {
  createPost,
  getPosts,
  getUserPosts,
  deletePost,
  likePost,
  unlikePost,
} = require(
  "../controllers/postController"
);

router.post(
  "/",
  protect,
  upload.single(
    "media"
  ),
  createPost
);

router.get("/", getPosts);

router.get(
  "/user/:id",
  getUserPosts
);

router.delete(
  "/:id",
  protect,
  deletePost
);

router.post(
  "/:id/like",
  protect,
  likePost
);

router.post(
  "/:id/unlike",
  protect,
  unlikePost
);

module.exports = router;