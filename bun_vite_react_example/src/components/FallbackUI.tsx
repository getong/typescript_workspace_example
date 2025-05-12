import React from "react";

interface FallbackUIProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

function FallbackUI({ error, resetErrorBoundary }: FallbackUIProps) {
  return (
    <div className="fallback-ui">
      <h2>Oops! Something went wrong.</h2>
      {error && <p className="error-message">Error: {error.message}</p>}
      <p>Please try refreshing the page or click the button below.</p>
      {resetErrorBoundary && (
        <button onClick={resetErrorBoundary} className="reset-button">
          Try Again
        </button>
      )}
    </div>
  );
}

export default FallbackUI;
