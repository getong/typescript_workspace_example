import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import BuggyCounter from "../components/BuggyCounter";

// Custom fallback UI
const ErrorFallback = ({ error }: { error?: Error }) => (
  <div className="error-fallback">
    <h3>Something went wrong! 🔥</h3>
    <p>The error was: {error?.message || "Unknown error"}</p>
    <p>Try refreshing the page to reset the demo</p>
  </div>
);

function ErrorBoundaryPage() {
  return (
    <div className="error-boundary-page">
      <h1>Error Boundary Demo</h1>
      <p>
        Error boundaries catch JavaScript errors in React components, log them,
        and display a fallback UI instead of crashing the component tree.
      </p>

      <div className="examples-container">
        <div className="example-box">
          <h2>Example 1: Default Error Boundary</h2>
          <ErrorBoundary>
            <BuggyCounter />
          </ErrorBoundary>
        </div>

        <div className="example-box">
          <h2>Example 2: Custom Fallback UI</h2>
          <ErrorBoundary
            fallback={<ErrorFallback error={new Error("Counter crashed!")} />}
          >
            <BuggyCounter />
          </ErrorBoundary>
        </div>
      </div>

      <div className="notes">
        <h3>Notes:</h3>
        <ul>
          <li>
            Error boundaries only catch errors in the components below them in
            the tree
          </li>
          <li>
            They don't catch errors inside event handlers (use try/catch there)
          </li>
          <li>
            They only work in production mode by default (errors will still
            bubble up in development)
          </li>
        </ul>
      </div>

      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default ErrorBoundaryPage;
