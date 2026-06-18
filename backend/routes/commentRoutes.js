const router =
  require("express").Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  addComment,
  deleteComment,
} = require(
  "../controllers/commentController"
);

router.post(
  "/",
  protect,
  addComment
);

router.delete(
  "/:id",
  protect,
  deleteComment
);

module.exports = router;