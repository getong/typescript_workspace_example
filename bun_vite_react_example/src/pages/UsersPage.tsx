import UsersList from "../components/UsersList";

function UsersPage() {
  return (
    <div className="users-page">
      <h2>Users List Demo</h2>
      <p>Demonstrating the useFetch hook with JSONPlaceholder API</p>
      <UsersList />
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default UsersPage;
