const Message =
  require(
    "../models/Message"
  );

const User =
  require("../models/User");
  
exports.sendMessage =
  async (
    req,
    res
  ) => {

    try {

      const message =
        await Message.create(
          {
            sender:
              req.user._id,

            receiver:
              req.body.receiver,

            text:
              req.body.text,
          }
        );

      res.status(201)
        .json(
          message
        );

    } catch (error) {

      res.status(500)
        .json({
          message:
            "Failed to send message",
        });

    }

  };

exports.getMessages =
  async (
    req,
    res
  ) => {

    try {

      const result =
await Message.updateMany(
  {
    sender:
      req.params.userId,

    receiver:
      req.user._id,

    $or: [
      { isRead:false },
      { isRead:{ $exists:false } }
    ]
  },
  {
    isRead:true
  }
);



      const messages =
        await Message.find(
          {
            $or: [

              {
                sender:
                  req.user._id,

                receiver:
                  req.params.userId,
              },

              {
                sender:
                  req.params.userId,

                receiver:
                  req.user._id,
              },

            ],
          }
        )
          .populate(
            "sender",
            "username"
          )
          .sort({
            createdAt: 1,
          });

      res.json(
        messages
      );

    } catch (error) {

      res.status(500)
        .json({
          message:
            "Failed to fetch messages",
        });

    }

  };

  exports.getMessagePreviews =
  async (
    req,
    res
  ) => {

    try {

      const currentUser =
        req.user._id;

      const messages =
        await Message.find({
          $or: [
            {
              sender:
                currentUser
            },
            {
              receiver:
                currentUser
            }
          ]
        })
        .sort({
          createdAt:-1
        });

      const previews =
        [];

      const addedUsers =
        new Set();

      for (
        const msg
        of messages
      ) {

        const otherUserId =
          msg.sender.toString() ===
          currentUser.toString()
            ? msg.receiver.toString()
            : msg.sender.toString();

        if (
          addedUsers.has(
            otherUserId
          )
        )
          continue;

        addedUsers.add(
          otherUserId
        );

        const user =
          await User.findById(
            otherUserId
          )
          .select(
            "username"
          );

        const unreadCount =
  await Message.countDocuments({

    sender:
      otherUserId,

    receiver:
      currentUser,

    $or: [
      { isRead:false },
      { isRead:{ $exists:false } }
    ]

  });

  console.log(
  "User:",
  user.username,
  "Unread:",
  unreadCount
);

previews.push({

  userId:
    user._id,

  username:
    user.username,

  lastMessage:
    msg.text,

  createdAt:
    msg.createdAt,

  unreadCount

});

      }

      res.json(
        previews
      );

    } catch (error) {

      res.status(500)
        .json({
          message:
            "Failed to load previews"
        });

    }

  };