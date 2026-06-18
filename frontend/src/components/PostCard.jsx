import API from "../services/api";
import CommentSection from "./CommentSection";
import "../styles/PostCard.css";
import {
  formatDistanceToNow
} from "date-fns";

function PostCard({
  post,
  refreshPosts
}) {

  const likePost = async () => {

    await API.post(
      `/posts/${post._id}/like`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem(
              "token"
            )}`
        }
      }
    );

    refreshPosts();
  };

  const unlikePost = async () => {

    await API.post(
      `/posts/${post._id}/unlike`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem(
              "token"
            )}`
        }
      }
    );

    refreshPosts();
  };

  const deletePost = async () => {

    await API.delete(
      `/posts/${post._id}`,
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem(
              "token"
            )}`
        }
      }
    );

    refreshPosts();
  };

  return (

    <div className="post-card">

      <div className="post-header">

        <div className="avatar">
          {
            post.user?.username
              ?.charAt(0)
              .toUpperCase()
          }
        </div>

        <div>

  <div className="username">
    {
      post.user?.username
    }
  </div>

  <div className="post-time">

    {
      formatDistanceToNow(
        new Date(
          post.createdAt
        ),
        {
          addSuffix:true
        }
      )
    }

  </div>

</div>
      </div>

      <div className="post-caption">
        {post.caption}
      </div>

      {
        post.mediaType ===
          "image" && (

          <img
            src={
              `http://localhost:5000${post.mediaUrl}`
            }
            alt="Post"
            className="post-media"
          />

        )
      }

      {
        post.mediaType ===
          "video" && (

          <video
            controls
            className="post-media"
          >
            <source
              src={
                `http://localhost:5000${post.mediaUrl}`
              }
            />
          </video>

        )
      }

      <div className="post-actions">

        <button
          className="action-btn"
          onClick={likePost}
        >
          ❤️ Like
        </button>

        <button
          className="action-btn"
          onClick={unlikePost}
        >
          💔 Unlike
        </button>

        {
  post.user?._id ===
  JSON.parse(
    localStorage.getItem(
      "user"
    )
  )._id && (

    <button
      className="action-btn"
      onClick={deletePost}
    >
      🗑 Delete
    </button>

  )
}

        <span
          className="likes-count"
        >
          {post.likes.length}
          {" "}Likes
        </span>

      </div>

      <CommentSection
        postId={post._id}
        comments={post.comments}
        refreshPosts={
          refreshPosts
        }
      />

    </div>

  );
}

export default PostCard;