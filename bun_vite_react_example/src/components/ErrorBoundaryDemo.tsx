import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import FallbackUI from "./FallbackUI";
import BuggyCounter from "./BuggyCounter";

function ErrorBoundaryDemo() {
  // Function to reset the error boundary state
  const handleReset = () => {
    // This could reset some state or perform other actions
    console.log("Reset triggered");
    window.location.reload();
  };

  return (
    <div className="error-boundary-demo">
      <h3>Error Boundary with Custom FallbackUI</h3>
      <ErrorBoundary fallback={<FallbackUI resetErrorBoundary={handleReset} />}>
        <BuggyCounter />
      </ErrorBoundary>
      <p className="demo-note">
        The component above will crash when the counter reaches 5, but the error
        will be caught and the fallback UI will be displayed.
      </p>
    </div>
  );
}

export default ErrorBoundaryDemo;
