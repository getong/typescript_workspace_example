import PostList from "../components/PostList";

function PostsPage() {
  return (
    <div className="posts-page">
      <h2>Posts List</h2>
      <p>Fetching posts from JSONPlaceholder API</p>
      <div className="posts-container">
        <PostList />
      </div>
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default PostsPage;
