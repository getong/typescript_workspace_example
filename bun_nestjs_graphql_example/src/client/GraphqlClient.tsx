import * as React from "react";
import { useState, useEffect, FormEvent } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  user?: User;
}

export const GraphqlClient: React.FC = () => {
  const GRAPHQL_URL = "http://localhost:3010/graphql";

  // State variables
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [createUserResult, setCreateUserResult] = useState<string>("");
  const [createNoteResult, setCreateNoteResult] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInitMessage, setShowInitMessage] = useState<boolean>(true);

  // Create User Form Handler
  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation CreateUser($createUserInput: CreateUserInput!) {
              createUser(createUserInput: $createUserInput) {
                id
                name
                email
              }
            }
          `,
          variables: {
            createUserInput: {
              name: userName,
              email: userEmail,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        setCreateUserResult(
          `<div class="error">Error: ${result.errors[0].message}</div>`,
        );
      } else {
        setCreateUserResult(
          `<div class="success">User created successfully!</div>` +
            `<pre>${JSON.stringify(result.data.createUser, null, 2)}</pre>`,
        );

        // Reset form
        setUserName("");
        setUserEmail("");

        // Auto-select the newly created user
        selectUser(result.data.createUser);

        // Refresh user list
        fetchAllUsers();
      }
    } catch (error: any) {
      setCreateUserResult(`<div class="error">Error: ${error.message}</div>`);
    }
  };

  // Create Note Form Handler
  const handleCreateNote = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation CreateNote($createNoteInput: CreateNoteInput!) {
              createNote(createNoteInput: $createNoteInput) {
                id
                title
                content
                userId
                createdAt
              }
            }
          `,
          variables: {
            createNoteInput: {
              title: noteTitle,
              content: noteContent,
              userId: selectedUser.id,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        setCreateNoteResult(
          `<div class="error">Error: ${result.errors[0].message}</div>`,
        );
      } else {
        setCreateNoteResult(
          `<div class="success">Note created successfully!</div>` +
            `<pre>${JSON.stringify(result.data.createNote, null, 2)}</pre>`,
        );

        // Reset form fields but keep the selected user
        setNoteTitle("");
        setNoteContent("");

        // Refresh notes list and specifically the user's notes
        if (selectedUser) {
          fetchUserNotes(selectedUser.id);
        } else {
          fetchAllNotes();
        }
      }
    } catch (error: any) {
      setCreateNoteResult(`<div class="error">Error: ${error.message}</div>`);
    }
  };

  // Select User Function
  const selectUser = (user: User) => {
    setSelectedUser(user);
    setCreateNoteResult("");
  };

  // Fetch All Users
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              users {
                id
                name
                email
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        setErrorMessage(`Error: ${result.errors[0].message}`);
        return;
      }

      setUsers(result.data.users || []);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  // Fetch All Notes
  const fetchAllNotes = async () => {
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              notes {
                id
                title
                content
                userId
                createdAt
                user {
                  id
                  name
                  email
                }
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        setErrorMessage(`Error: ${result.errors[0].message}`);
        return;
      }

      setNotes(result.data.notes || []);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  // Fetch Notes for a Specific User
  const fetchUserNotes = async (userId: number) => {
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query($userId: Int!) {
              notesByUser(userId: $userId) {
                id
                title
                content
                userId
                createdAt
              }
            }
          `,
          variables: {
            userId: parseInt(userId.toString()),
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        setErrorMessage(`Error: ${result.errors[0].message}`);
        return;
      }

      setNotes(result.data.notesByUser || []);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  // Initialize app
  useEffect(() => {
    fetchAllUsers();

    // Auto-hide the initialization message after 10 seconds
    const timer = setTimeout(() => {
      setShowInitMessage(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>GraphQL Client Example</h1>

      <div className="instruction">
        <p>
          <strong>Instructions:</strong> First create a user, then select that
          user from the list before creating a note.
        </p>
      </div>

      {showInitMessage && (
        <div className="instruction">
          <p>
            The application has been initialized with sample users. Select a
            user to create notes.
          </p>
        </div>
      )}

      <div className="card">
        <h2>Create User</h2>
        <form onSubmit={handleCreateUser}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              required
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <button type="submit">Create User</button>
        </form>
        <div dangerouslySetInnerHTML={{ __html: createUserResult }} />
      </div>

      <div className="card">
        <h2>User Management</h2>
        <button onClick={fetchAllUsers}>Fetch Users</button>
        <div id="usersContainer">
          {users.length === 0 ? (
            <div className="error">
              <p>
                No users found. Please create a user first or run database
                initialization.
              </p>
              <p>
                Run <code>bun run init:db</code> in your terminal to create
                sample users.
              </p>
            </div>
          ) : (
            <>
              <h3>Click on a user to select them:</h3>
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`user-item ${selectedUser?.id === user.id ? "selected" : ""}`}
                  onClick={() => {
                    selectUser(user);
                  }}
                >
                  <strong>{user.name}</strong> (ID: {user.id})<br />
                  <small>{user.email}</small>
                </div>
              ))}
            </>
          )}
        </div>
        {selectedUser && (
          <div className="user-info">
            <strong>Selected User:</strong> <span>{selectedUser.name}</span>{" "}
            (ID:
            <span>{selectedUser.id}</span>)
          </div>
        )}
      </div>

      <div className="card">
        <h2>Create Note</h2>
        {!selectedUser ? (
          <div className="instruction">
            <p>Please select a user first before creating a note.</p>
          </div>
        ) : (
          <form onSubmit={handleCreateNote}>
            <div>
              <label htmlFor="noteTitle">Title:</label>
              <input
                type="text"
                id="noteTitle"
                required
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="noteContent">Content:</label>
              <textarea
                id="noteContent"
                required
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="noteUserId">User ID:</label>
              <input
                type="number"
                id="noteUserId"
                readOnly
                value={selectedUser.id}
              />
            </div>
            <button type="submit">Create Note</button>
          </form>
        )}
        <div dangerouslySetInnerHTML={{ __html: createNoteResult }} />
      </div>

      <div className="card">
        <h2>Notes Management</h2>
        <div>
          <button onClick={fetchAllNotes}>Fetch All Notes</button>
          {selectedUser && (
            <button
              className="secondary"
              onClick={() => fetchUserNotes(selectedUser.id)}
            >
              Fetch Selected User's Notes
            </button>
          )}
        </div>
        <div id="notesList">
          {errorMessage ? (
            <div className="error">{errorMessage}</div>
          ) : notes.length > 0 ? (
            <>
              <h3>
                {selectedUser
                  ? `Notes for User ID ${selectedUser.id}:`
                  : "All Notes:"}
              </h3>
              <pre>{JSON.stringify(notes, null, 2)}</pre>
            </>
          ) : (
            <p>
              {selectedUser
                ? `No notes found for user with ID ${selectedUser.id}.`
                : "No notes found."}
            </p>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .card {
          border: 1px solid #ddd;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 5px;
        }
        button {
          padding: 8px 16px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin: 5px;
        }
        button.secondary {
          background-color: #2196f3;
        }
        input,
        textarea {
          width: 100%;
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        pre {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          overflow: auto;
        }
        .error {
          color: red;
          font-weight: bold;
        }
        .success {
          color: green;
          font-weight: bold;
        }
        .user-item {
          border: 1px solid #eee;
          padding: 10px;
          margin-bottom: 5px;
          border-radius: 4px;
          cursor: pointer;
        }
        .user-item:hover {
          background-color: #f9f9f9;
        }
        .user-item.selected {
          border-color: #4caf50;
          background-color: #e8f5e9;
        }
        .user-info {
          margin-top: 15px;
          padding: 10px;
          background-color: #e8f5e9;
          border-radius: 4px;
          border-left: 4px solid #4caf50;
        }
        .instruction {
          padding: 10px;
          background-color: #e3f2fd;
          border-radius: 4px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};
