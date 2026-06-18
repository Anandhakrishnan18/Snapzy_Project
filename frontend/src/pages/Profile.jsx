import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [editMode, setEditMode] =
    useState(false);

  const [username, setUsername] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [isFollowing,
  setIsFollowing] =
  useState(false);

  const [showSettings,
  setShowSettings] =
  useState(false);

  const [activeSetting,
  setActiveSetting] =
  useState("menu");

  const [myComments,
  setMyComments] =
  useState([]); 

  const [userPosts,
  setUserPosts] =
  useState([]);

  const [selectedPost,
  setSelectedPost] =
  useState(null);

  const [pauseAllMessages,
  setPauseAllMessages] =
  useState(false);

const [pauseSpecificUsers,
  setPauseSpecificUsers] =
  useState(false);

const [enableNotifications,
  setEnableNotifications] =
  useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get(
        `/users/${id}`
      );

      setUser(res.data);

      setUsername(
        res.data.username
      );

      setBio(
        res.data.bio || ""
      );

      const currentUser =
  JSON.parse(
    localStorage.getItem(
      "user"
    )
  );

setIsFollowing(
  res.data.followers.includes(
    currentUser._id
  )
);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile =
    async () => {
      try {
        await API.put(
          `/users/${id}`,
          {
            username,
            bio,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

        setEditMode(false);

        fetchUser();
      } catch (error) {
        console.log(error);
      }
    };


     const followUser =
  async () => {

    try {

      await API.post(
        `/users/${id}/follow`,
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

      fetchUser();

    } catch (error) {

      console.log(error);

    }
  };

const fetchMyComments =
  async () => {

    try {

      const res =
        await API.get(
          "/comments/my-comments",
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem(
                  "token"
                )}`
            }
          }
        );

      setMyComments(
        res.data
      );

    } catch (error) {

      console.log(error);

    }

  };


  const fetchUserPosts =
  async () => {

    try {

      const res =
        await API.get(
          `/posts/user/${id}`
        );

      setUserPosts(
        res.data
      );

    } catch (error) {

      console.log(error);

    }

  };

  const unfollowUser =
  async () => {

    try {

      await API.post(
        `/users/${id}/unfollow`,
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

      fetchUser();

    } catch (error) {

      console.log(error);

    }
  };

useEffect(() => {

  fetchUser();

  fetchUserPosts();

}, [id]);

  if (!user)
    return <h2>Loading...</h2>;

  return (

  <div className="profile-page">

    <div className="profile-card">

      <div
        className="settings-icon"
        onClick={() =>
          setShowSettings(
            !showSettings
          )
        }
      >
        ⚙️
      </div>

      {
        showSettings && (

          <div className="settings-panel">

  {
    activeSetting ===
    "menu" && (

      <>

        <h3>
          Settings
        </h3>

        <div
          onClick={() =>
            setActiveSetting(
              "account"
            )
          }
        >
           Account
        </div>

        <div
          onClick={() =>
            setActiveSetting(
              "notifications"
            )
          }
        >
           Notifications
        </div>
    

        <div
  onClick={() => {

    setActiveSetting(
      "comments"
    );

    fetchMyComments();

  }}
>
   Comments History
</div>

        <div
          onClick={() =>
            setActiveSetting(
              "help"
            )
          }
        >
           Help
        </div>

      </>

    )
  }

  {
    activeSetting ===
    "account" && (

      <>

        <h3>
          Account
        </h3>

        <div>
  Username:
  {user.username}
</div>


        <div>
          Email:
          {
            user.email
          }
        </div>

        <div>
          Change Password
        </div>

        <div>
          Forgot Password
        </div>

        <div>
          Blocked Users
        </div>

        <div
          style={{
            color:
              "#ef4444"
          }}
        >
          Delete Account
        </div>

        <button
          className="back-btn"
          onClick={() =>
            setActiveSetting(
              "menu"
            )
          }
        >
          ← Back
        </button>

      </>

    )
  }

  {
  activeSetting ===
  "comments" && (

    <>

      <h3>
        Comments History
      </h3>

      {
        myComments.length ===
        0 ? (

          <p>
            No comments found
          </p>

        ) : (

          myComments.map(
            (item) => (

              <div
                key={item._id}
                className="comment-history-card"
              >

                <strong>
                  Post:
                </strong>

                <p>
                  {
                    item.post
                      ?.caption
                  }
                </p>

                <strong>
                  Comment:
                </strong>

                <p>
                  {
                    item.comment
                  }
                </p>

              </div>

            )
          )

        )
      }

      <button
        className="back-btn"
        onClick={() =>
          setActiveSetting(
            "menu"
          )
        }
      >
        ← Back
      </button>

    </>

  )
}


{
  activeSetting ===
  "notifications" && (

    <>

      <h3>
        Notifications
      </h3>

      <div
        className="setting-option"
      >

        <label>

          <input
            type="checkbox"
            checked={
              enableNotifications
            }
            onChange={() =>
              setEnableNotifications(
                !enableNotifications
              )
            }
          />

          Enable Notifications

        </label>

      </div>

      <div
        className="setting-option"
      >

        <label>

          <input
            type="checkbox"
            checked={
              pauseAllMessages
            }
            onChange={() =>
              setPauseAllMessages(
                !pauseAllMessages
              )
            }
          />

          Pause All Messages

        </label>

      </div>

      <div
        className="setting-option"
      >

        <label>

          <input
            type="checkbox"
            checked={
              pauseSpecificUsers
            }
            onChange={() =>
              setPauseSpecificUsers(
                !pauseSpecificUsers
              )
            }
          />

          Pause Specific User Messages

        </label>

      </div>

      <button
        className="back-btn"
        onClick={() =>
          setActiveSetting(
            "menu"
          )
        }
      >
        ← Back
      </button>

    </>

  )
}

{
  activeSetting ===
  "help" && (

    <>

      <h3>
        Help Center
      </h3>

      <div
        className="setting-option"
      >
        📢 Report a Problem
      </div>

      <div
        className="setting-option"
      >
        📧 Contact Support
      </div>

      <div
        className="setting-option"
      >
        📖 FAQ
      </div>

      <button
        className="back-btn"
        onClick={() =>
          setActiveSetting(
            "menu"
          )
        }
      >
        ← Back
      </button>

    </>

  )
}


</div>

        )
      }

      {editMode ? (

        <>

          <input
            className="edit-input"
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

          <textarea
            className="edit-textarea"
            value={bio}
            onChange={(e) =>
              setBio(
                e.target.value
              )
            }
          />

          <button
            className="profile-btn"
            onClick={
              updateProfile
            }
          >
            Save Changes
          </button>

        </>

      ) : (

        <>

          <div
            className="profile-avatar"
          >
            {
              user.username
                ?.charAt(0)
                .toUpperCase()
            }
          </div>

          <div
            className="profile-name"
          >
            {user.username}
          </div>

          <div
            className="profile-email"
          >
            {user.email}
          </div>

          <div
            className="profile-bio"
          >
            {
              user.bio ||
              "No bio available"
            }
          </div>

          <div
            className="profile-stats"
          >

            <div
              className="stat-box"
            >
              <h3>
                {
                  user.followers
                    .length
                }
              </h3>

              <p>
                Followers
              </p>
            </div>

            <div
              className="stat-box"
            >
              <h3>
                {
                  user.following
                    .length
                }
              </h3>

              <p>
                Following
              </p>
            </div>

          </div>

          <div
            className="profile-actions"
          >

            {
              JSON.parse(
                localStorage.getItem(
                  "user"
                )
              )._id !== id && (

                isFollowing ? (

                  <button
                    className="profile-btn"
                    onClick={
                      unfollowUser
                    }
                  >
                    Unfollow
                  </button>

                ) : (

                  <button
                    className="profile-btn"
                    onClick={
                      followUser
                    }
                  >
                    Follow
                  </button>

                )

              )
            }

            <button
              className="profile-btn"
              onClick={() =>
                setEditMode(
                  true
                )
              }
            >
              Edit Profile
            </button>

          </div>

        </>

      )}

    </div>

<div className="user-posts-section">

  <h2>
    Posts
  </h2>

  {
    userPosts.length === 0 ? (

      <p>
        No posts yet
      </p>

    ) : (

      <div className="posts-grid">

        {
          userPosts.map(
            (post) => (

              <div
  key={post._id}
  className="grid-post"
  onClick={() =>
    setSelectedPost(
      post
    )
  }
>

                {
                  post.mediaType ===
                  "image" && (

                    <img
                      src={
                        `http://localhost:5000${post.mediaUrl}`
                      }
                      alt="Post"
                    />

                  )
                }

                {
                  post.mediaType ===
                  "video" && (

                    <video
                      muted
                    >
                      <source
                        src={
                          `http://localhost:5000${post.mediaUrl}`
                        }
                      />
                    </video>

                  )
                }

              </div>

            )
          )
        }

      </div>

    )
  }


{
  selectedPost && (

    <div
      className="post-modal"
    >

      <div
        className="post-modal-content"
      >

        <button
          className="close-modal"
          onClick={() =>
            setSelectedPost(
              null
            )
          }
        >
          ✕
        </button>

        {
          selectedPost.mediaType ===
          "image" && (

            <img
              src={
                `http://localhost:5000${selectedPost.mediaUrl}`
              }
              alt="Post"
              className="modal-media"
            />

          )
        }

        {
          selectedPost.mediaType ===
          "video" && (

            <video
              controls
              className="modal-media"
            >

              <source
                src={
                  `http://localhost:5000${selectedPost.mediaUrl}`
                }
              />

            </video>

          )
        }

        <h3>
          {
            selectedPost.caption
          }
        </h3>

        <p>
          ❤️ {
            selectedPost.likes
              ?.length || 0
          } Likes
        </p>

        <p>
          💬 {
            selectedPost.comments
              ?.length || 0
          } Comments
        </p>

       {
  selectedPost.user?._id ===
  JSON.parse(
    localStorage.getItem(
      "user"
    )
  )._id && (

    <button
      className="delete-post-btn"
      onClick={async () => {

        try {

          await API.delete(
            `/posts/${selectedPost._id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem(
                    "token"
                  )}`
              }
            }
          );

          setSelectedPost(
            null
          );

          fetchUserPosts();

        } catch (error) {

          console.log(
            error
          );

        }

      }}
    >
      🗑 Delete Post
    </button>

  )
}

      </div>

    </div>

  )
}

</div>
  </div>

);
}

export default Profile;