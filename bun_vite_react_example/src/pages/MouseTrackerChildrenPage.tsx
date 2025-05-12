import React from "react";
import ChildrenMouseTracker from "../components/ChildrenMouseTracker";

function MouseTrackerChildrenPage() {
  return (
    <div className="mouse-tracker-page">
      <h1>Children Prop - Mouse Tracker</h1>
      <p>Demonstrating the "children as a function" pattern</p>
      <div className="tracker-container">
        <ChildrenMouseTracker>
          {({ x, y }) => (
            <h2>
              Mouse at ({x}, {y})
            </h2>
          )}
        </ChildrenMouseTracker>
      </div>
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default MouseTrackerChildrenPage;
