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
  }, []);

  if (!user)
    return <h2>Loading...</h2>;

  return (

  <div className="profile-page">

    <div className="profile-card">

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

  </div>

);
}

export default Profile;