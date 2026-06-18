const router =
  require("express").Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  addComment,
  deleteComment,
  getMyComments,
} = require(
  "../controllers/commentController"
);

router.post(
  "/",
  protect,
  addComment
);

router.get(
  "/my-comments",
  protect,
  getMyComments
);

router.delete(
  "/:id",
  protect,
  deleteComment
);

module.exports = router;