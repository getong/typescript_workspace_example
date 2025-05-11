import React, { useState, useEffect } from "react";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function PostListWithAxios() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <ul className="posts-list">
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default PostListWithAxios;
