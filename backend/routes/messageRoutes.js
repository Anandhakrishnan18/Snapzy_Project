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
  getMessagePreviews
} = require(
  "../controllers/messageController"
);

router.post(
  "/send",
  protect,
  sendMessage
);

router.get(
  "/preview/list",
  protect,
  getMessagePreviews
);

router.get(
  "/:userId",
  protect,
  getMessages
);

module.exports =
  router;