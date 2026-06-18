import { useState } from "react";
import API from "../services/api";
import "../styles/CommentSection.css";

function CommentSection({
  postId,
  comments,
  refreshPosts
}) {

  const [comment,
    setComment] =
    useState("");

  const addComment =
    async () => {

      try {

        await API.post(
          "/comments",
          {
            postId,
            comment
          },
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem(
                  "token"
                )}`
            }
          }
        );

        setComment("");

        refreshPosts();

      } catch (error) {

        console.log(error);

      }
    };

  const deleteComment =
    async (commentId) => {

      try {

        await API.delete(
          `/comments/${commentId}`,
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

      } catch (error) {

        console.log(error);

      }
    };

  return (

    <div className="comment-section">

      <div className="comments-list">

        {
          comments &&
          comments.map(
            (item) => (

              <div
                key={item._id}
                className="comment-item"
              >

                <div
                  className="comment-left"
                >

                  <div
                    className="comment-avatar"
                  >
                    {
                      item.user?.username
                        ?.charAt(0)
                        .toUpperCase()
                    }
                  </div>

                  <div
                    className="comment-content"
                  >

                    <div
                      className="comment-user"
                    >
                      {
                        item.user?.username
                      }
                    </div>

                    <div
                      className="comment-text"
                    >
                      {
                        item.comment
                      }
                    </div>

                  </div>

                </div>

                {
  item.user?._id ===
  JSON.parse(
    localStorage.getItem(
      "user"
    )
  )._id && (

    <button
      className="comment-delete"
      onClick={() =>
        deleteComment(
          item._id
        )
      }
    >
      Delete
    </button>

  )
}

              </div>

            )
          )
        }

      </div>

      <div
        className="comment-input-row"
      >

        <input
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
        />

        <button
          onClick={addComment}
        >
          Comment
        </button>

      </div>

    </div>
  );
}

export default CommentSection;