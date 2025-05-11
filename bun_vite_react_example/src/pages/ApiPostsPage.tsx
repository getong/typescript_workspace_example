import ApiPostList from "../components/ApiPostList";

function ApiPostsPage() {
  return (
    <div className="posts-page">
      <h2>Posts List (API Service)</h2>
      <p>Fetching posts using custom API service</p>
      <div className="posts-container">
        <ApiPostList />
      </div>
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default ApiPostsPage;
