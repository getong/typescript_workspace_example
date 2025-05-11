import PostListWithAxios from "../components/PostListWithAxios";

function AxiosPostsPage() {
  return (
    <div className="posts-page">
      <h2>Posts List (Axios)</h2>
      <p>Fetching posts using Axios from JSONPlaceholder API</p>
      <div className="posts-container">
        <PostListWithAxios />
      </div>
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default AxiosPostsPage;
