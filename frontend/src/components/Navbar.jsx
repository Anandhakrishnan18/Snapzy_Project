import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Navbar.css";

function Navbar() {

  const navigate =
    useNavigate();

  const [search,
    setSearch] =
    useState("");

  const [results,
    setResults] =
    useState([]);

  const logout = () => {

    localStorage.clear();

    navigate("/");
  };

  const searchUsers =
    async (value) => {

      setSearch(value);

      if (
        value.trim() === ""
      ) {

        setResults([]);

        return;
      }

      try {

        const res =
          await API.get(
            `/users/search/${value}`
          );

        setResults(
          res.data
        );

      } catch (error) {

        console.log(error);

      }
    };

  return (

    <nav className="navbar">

      <div
        className="navbar-logo"
        onClick={() =>
          navigate("/home")
        }
        style={{
          cursor:"pointer"
        }}
      >
        📸 Snapzy
      </div>

      <div
        className="navbar-center"
      >

        <input
          className="navbar-search"
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            searchUsers(
              e.target.value
            )
          }
        />

        {
          results.length > 0 && (

            <div
              className="search-results"
            >

              {
                results.map(
                  (user) => (

                    <div
                      key={
                        user._id
                      }
                      className="search-item"
                      onClick={() => {

                        navigate(
                          `/profile/${user._id}`
                        );

                        setResults([]);

                        setSearch("");

                      }}
                    >

                      👤 {user.username}

                    </div>

                  )
                )
              }

            </div>

          )
        }

      </div>

      <div
        className="navbar-right"
      >

        <button
          className="nav-btn"
          onClick={() =>
            navigate("/home")
          }
        >
          🏠 Home
        </button>

        <button
  onClick={() =>
    navigate(
      "/messages"
    )
  }
>
  Messages
</button>

        <button
          className="nav-btn"
          onClick={() => {

            const user =
              JSON.parse(
                localStorage.getItem(
                  "user"
                )
              );

            navigate(
              `/profile/${user._id}`
            );

          }}
        >
          👤 Profile
        </button>

        <button
          className="nav-btn"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </div>

    </nav>

  );
}

export default Navbar;