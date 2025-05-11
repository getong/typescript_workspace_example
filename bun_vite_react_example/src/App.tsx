import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CounterPage from "./pages/CounterPage";
import UsersPage from "./pages/UsersPage";

function App() {
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState<"home" | "counter" | "users">(
    "home",
  );

  if (currentPage === "counter") {
    return <CounterPage />;
  }

  if (currentPage === "users") {
    return <UsersPage />;
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <div className="page-navigation">
          <button onClick={() => setCurrentPage("counter")}>
            Go to Counter Page
          </button>
          <button onClick={() => setCurrentPage("users")}>
            Go to Users Page
          </button>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
