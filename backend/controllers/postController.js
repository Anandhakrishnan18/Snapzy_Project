const Post =
  require("../models/Post");

exports.createPost = async (
  req,
  res
) => {
  try {

    let mediaUrl = "";
    let mediaType = "";

    if (req.file) {

      mediaUrl =
        `/uploads/${req.file.filename}`;

      if (
        req.file.mimetype.startsWith(
          "image"
        )
      ) {

        mediaType = "image";

      } else if (
        req.file.mimetype.startsWith(
          "video"
        )
      ) {

        mediaType = "video";

      }

    }

    const post =
      await Post.create({

        user:
          req.user._id,

        caption:
          req.body.caption,

        mediaUrl,

        mediaType,

      });

    res.status(201).json(
      post
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to create post",
    });

  }
};

exports.getPosts = async (
  req,
  res
) => {
  try {

    const posts =
      await Post.find()
        .populate(
          "user",
          "username"
        )
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select:
              "username",
          },
        })
        .sort({
          createdAt: -1,
        });

    res.json(posts);

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to fetch posts",
    });

  }
};

exports.deletePost = async (
  req,
  res
) => {
  try {

    const post =
      await Post.findById(
        req.params.id
      );

    if (!post) {

      return res.status(404)
        .json({
          message:
            "Post not found"
        });

    }

    if (
      post.user.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403)
        .json({
          message:
            "Not authorized"
        });

    }

    await post.deleteOne();

    res.json({
      message:
        "Deleted"
    });

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to delete post"
    });

  }
};

exports.likePost = async (
  req,
  res
) => {
  try {

    const post =
      await Post.findById(
        req.params.id
      );

    if (
      !post.likes.includes(
        req.user._id
      )
    ) {

      post.likes.push(
        req.user._id
      );

      await post.save();
    }

    res.json({
      message:
        "Liked",
    });

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to like post",
    });

  }
};

exports.unlikePost = async (
  req,
  res
) => {
  try {

    const post =
      await Post.findById(
        req.params.id
      );

    post.likes =
      post.likes.filter(
        (id) =>
          id.toString() !==
          req.user._id.toString()
      );

    await post.save();

    res.json({
      message:
        "Unliked",
    });

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to unlike post",
    });

  }
};