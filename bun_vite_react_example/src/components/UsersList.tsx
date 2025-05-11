import useFetch from "../hooks/useFetch";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

function UsersList() {
  const { data, loading, error } = useFetch<User[]>(
    "https://jsonplaceholder.typicode.com/users",
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UsersList;
