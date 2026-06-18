const Comment =
  require("../models/Comment");

const Post =
  require("../models/Post");

exports.addComment = async (
  req,
  res
) => {
  try {

    const comment =
      await Comment.create({
        post: req.body.postId,
        user: req.user._id,
        comment:
          req.body.comment,
      });

    const post =
      await Post.findById(
        req.body.postId
      );

    post.comments.push(
      comment._id
    );

    await post.save();

    res.status(201).json(
      comment
    );

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to add comment",
    });

  }
};

exports.deleteComment = async (
  req,
  res
) => {
  try {

    const comment =
      await Comment.findById(
        req.params.id
      );

    if (!comment) {

      return res.status(404).json({
        message:
          "Comment not found",
      });

    }

    // Only comment owner can delete

    if (
      comment.user.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "Not authorized to delete this comment",
      });

    }

    await Post.findByIdAndUpdate(
      comment.post,
      {
        $pull: {
          comments:
            comment._id,
        },
      }
    );

    await Comment.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Comment Deleted",
    });

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to delete comment",
    });

  }
};

exports.getMyComments = async (
  req,
  res
) => {

  try {

    const comments =
      await Comment.find({
        user:
          req.user._id,
      })
      .populate(
        "post",
        "caption"
      )
      .sort({
        createdAt: -1,
      });

    res.json(
      comments
    );

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to fetch comments",
    });

  }

};