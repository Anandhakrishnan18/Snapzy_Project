import {
  useEffect,
  useState
} from "react";

import API from "../services/api";

import Navbar from "../components/Navbar";

import CreatePost from "../components/CreatePost";

import PostCard from "../components/PostCard";

import "../styles/Home.css";

function Home() {

  const [posts, setPosts] =
    useState([]);

  const fetchPosts =
    async () => {

      try {

        const res =
          await API.get(
            "/posts"
          );

        setPosts(
          res.data
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchPosts();

  }, []);

  return (

  <div className="home-page">

    <Navbar />

    <div className="feed-container">

      <CreatePost
        refreshPosts={
          fetchPosts
        }
      />

      {posts.map(
        (post) => (

          <PostCard
            key={post._id}
            post={post}
            refreshPosts={
              fetchPosts
            }
          />

        )
      )}

    </div>

  </div>

);
}

export default Home;