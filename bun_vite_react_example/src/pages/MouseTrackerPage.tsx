import React from "react";
import MouseTracker from "../components/MouseTracker";

function MouseTrackerPage() {
  return (
    <div className="mouse-tracker-page">
      <h1>Move the mouse around!</h1>
      <div className="tracker-container">
        <MouseTracker
          render={({ x, y }) => (
            <h2>
              The current mouse position is ({x}, {y})
            </h2>
          )}
        />
      </div>
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default MouseTrackerPage;
