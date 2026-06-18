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

      const currentUser =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      const filteredPosts =
        res.data.filter(
          (post) =>
            post.user?._id !==
            currentUser._id
        );

      setPosts(
        filteredPosts
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

      {
  posts.length === 0 ? (

    <div
      className="empty-feed"
    >
      No posts available
    </div>

  ) : (

    posts.map(
      (post) => (

        <PostCard
          key={post._id}
          post={post}
          refreshPosts={
            fetchPosts
          }
        />

      )
    )

  )
}

    </div>

  </div>

);
}

export default Home;