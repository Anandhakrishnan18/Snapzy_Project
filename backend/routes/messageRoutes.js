const router =
  require("express")
    .Router();

const protect =
  require(
    "../middleware/authMiddleware"
  );

const {
  sendMessage,
  getMessages,
} = require(
  "../controllers/messageController"
);

router.post(
  "/send",
  protect,
  sendMessage
);

router.get(
  "/:userId",
  protect,
  getMessages
);

module.exports =
  router;