import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CounterPage from "./pages/CounterPage";
import UsersPage from "./pages/UsersPage";
import ResponsivePage from "./pages/ResponsivePage";
import ContactPage from "./pages/ContactPage";
import ValidatedFormPage from "./pages/ValidatedFormPage";
import PostsPage from "./pages/PostsPage";
import AxiosPostsPage from "./pages/AxiosPostsPage";
import ApiPostsPage from "./pages/ApiPostsPage";
import ThemeContext from "./context/ThemeContext";
import MouseTrackerPage from "./pages/MouseTrackerPage";
import MouseTrackerChildrenPage from "./pages/MouseTrackerChildrenPage";
import MouseHookPage from "./pages/MouseHookPage";

// Import the page without HOC and apply HOC here
import ThemePage from "./pages/ProtectedThemePage";
import withAuthProtection from "./hoc/withAuthProtection";

// Create the protected component
const ProtectedThemePage = withAuthProtection(ThemePage);

function App() {
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState<
    | "home"
    | "counter"
    | "users"
    | "responsive"
    | "contact"
    | "validated-form"
    | "posts"
    | "axios-posts"
    | "api-posts"
    | "protected-theme"
    | "mouse-tracker"
    | "mouse-tracker-children"
    | "mouse-hook"
  >("home");

  // Page routing
  if (currentPage === "counter") return <CounterPage />;
  if (currentPage === "users") return <UsersPage />;
  if (currentPage === "responsive") return <ResponsivePage />;
  if (currentPage === "contact") return <ContactPage />;
  if (currentPage === "validated-form") return <ValidatedFormPage />;
  if (currentPage === "posts") return <PostsPage />;
  if (currentPage === "axios-posts") return <AxiosPostsPage />;
  if (currentPage === "api-posts") return <ApiPostsPage />;
  if (currentPage === "protected-theme") return <ProtectedThemePage />;
  if (currentPage === "mouse-tracker") return <MouseTrackerPage />;
  if (currentPage === "mouse-tracker-children")
    return <MouseTrackerChildrenPage />;
  if (currentPage === "mouse-hook") return <MouseHookPage />;

  return (
    <ThemeContext.Provider value="light">
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
          <button onClick={() => setCurrentPage("responsive")}>
            Go to Responsive Page
          </button>
          <button onClick={() => setCurrentPage("contact")}>
            Go to Contact Page
          </button>
          <button onClick={() => setCurrentPage("validated-form")}>
            Go to Validated Form
          </button>
          <button onClick={() => setCurrentPage("posts")}>
            Go to Posts Page
          </button>
          <button onClick={() => setCurrentPage("axios-posts")}>
            Go to Axios Posts Page
          </button>
          <button onClick={() => setCurrentPage("api-posts")}>
            Go to API Posts
          </button>
          <button onClick={() => setCurrentPage("protected-theme")}>
            Go to Protected Theme Page
          </button>
          <button onClick={() => setCurrentPage("mouse-tracker")}>
            Go to Mouse Tracker (Render Props)
          </button>
          <button onClick={() => setCurrentPage("mouse-tracker-children")}>
            Go to Mouse Tracker (Children Prop)
          </button>
          <button onClick={() => setCurrentPage("mouse-hook")}>
            Go to Mouse Tracker (Hook)
          </button>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </ThemeContext.Provider>
  );
}

export default App;
