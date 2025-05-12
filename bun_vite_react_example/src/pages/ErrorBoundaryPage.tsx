import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import BuggyCounter from "../components/BuggyCounter";
import FallbackUI from "../components/FallbackUI";
import ErrorBoundaryDemo from "../components/ErrorBoundaryDemo";

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
          <h2>Example 2: With Custom FallbackUI</h2>
          <ErrorBoundaryDemo />
        </div>
      </div>

      <div className="example-code">
        <h3>Example Code:</h3>
        <pre>
          {`// Using the FallbackUI component
function App() {
  return (
    <ErrorBoundary fallback={<FallbackUI />}>
      <MyComponent />
    </ErrorBoundary>
  );
}`}
        </pre>
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
