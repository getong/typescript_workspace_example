import React from "react";

function withAuthProtection(WrappedComponent: React.ComponentType<any>) {
  return function AuthProtectedComponent(props: any) {
    const isAuthenticated = !!localStorage.getItem("authToken");

    if (!isAuthenticated) {
      // Instead of redirect, show a login prompt
      return (
        <div className="auth-required">
          <h3>Authentication Required</h3>
          <p>Please log in to access this page.</p>
          <button
            onClick={() => {
              localStorage.setItem("authToken", "demo-token-123");
              window.location.reload();
            }}
          >
            Login (Demo)
          </button>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuthProtection;
