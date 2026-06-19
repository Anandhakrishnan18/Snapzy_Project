const Message =
  require(
    "../models/Message"
  );

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