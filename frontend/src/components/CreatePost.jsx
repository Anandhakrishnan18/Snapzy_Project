import { useState } from "react";
import API from "../services/api";
import "../styles/CreatePost.css";

function CreatePost({ refreshPosts }) {

  const [caption, setCaption] =
    useState("");

  const [media, setMedia] =
    useState(null);

  const submitPost = async () => {

    try {

      const formData =
        new FormData();

      formData.append(
        "caption",
        caption
      );

      if (media) {

        formData.append(
          "media",
          media
        );

      }

      await API.post(
        "/posts",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem(
                "token"
              )}`,
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      setCaption("");
      setMedia(null);

      refreshPosts();

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="create-post">

      <h3
        className="create-post-title"
      >
        What's happening today?
      </h3>

      <textarea
        placeholder="Share your thoughts with Snapzy..."
        value={caption}
        onChange={(e) =>
          setCaption(
            e.target.value
          )
        }
      />

      <label
  htmlFor="file-upload"
  className="upload-btn"
>
  📷 Add Photo / Video
</label>

<input
  id="file-upload"
  type="file"
  accept="image/*,video/*"
  hidden
  onChange={(e) =>
    setMedia(
      e.target.files[0]
    )
  }
/>

{
  media && (
    <p className="selected-file">
      {media.name}
    </p>
  )
}

      <div
        className="create-post-footer"
      >

        <button
          className="post-btn"
          onClick={submitPost}
        >
          Share
        </button>

      </div>

    </div>

  );
}

export default CreatePost;