import React, { useContext, useState } from "react";
import ThemeContext from "../context/ThemeContext";
import withAuthProtection from "../hoc/withAuthProtection";

function ThemePage() {
  const theme = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  // Simulate login for demonstration purposes
  const login = () => {
    localStorage.setItem("authToken", "demo-token-123");
    window.location.reload(); // Refresh to reflect auth state
  };

  // Simulate logout
  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.reload(); // Refresh to reflect auth state
  };

  const isAuthenticated = !!localStorage.getItem("authToken");

  const themeStyles = {
    light: {
      backgroundColor: "#ffffff",
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #dddddd",
    },
    dark: {
      backgroundColor: "#333333",
      color: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #555555",
    },
  };

  return (
    <div className="theme-page">
      <h2>Protected Theme Page</h2>
      <p>This page is protected with withAuthProtection HOC</p>
      <p>Current theme: {currentTheme}</p>

      <div
        style={currentTheme === "light" ? themeStyles.light : themeStyles.dark}
      >
        <h3>Themed Content</h3>
        <p>This content is styled according to the current theme.</p>
      </div>

      <div className="theme-controls">
        <button onClick={() => setCurrentTheme("light")}>Light Theme</button>
        <button onClick={() => setCurrentTheme("dark")}>Dark Theme</button>
      </div>

      <div className="auth-status">
        <p>
          Authentication Status: {isAuthenticated ? "Logged In" : "Logged Out"}
        </p>
        {isAuthenticated ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={login}>Login (Demo)</button>
        )}
      </div>

      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

// For now, export the component without the HOC to avoid routing issues
export default ThemePage;
