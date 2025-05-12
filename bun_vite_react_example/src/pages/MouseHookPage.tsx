import React from "react";
import ShowMouse from "../components/ShowMouse";

function MouseHookPage() {
  return (
    <div className="mouse-tracker-page">
      <h1>Mouse Position Hook Demo</h1>
      <p>Demonstrating a custom hook for mouse position tracking</p>
      <div className="tracker-container">
        <ShowMouse />
      </div>
      <div className="compare-approaches">
        <h3>Hook-based Approach vs Class Components</h3>
        <p>
          This page demonstrates a functional approach to mouse tracking using a
          custom hook. Compare with the render props and children as function
          patterns shown in the other examples.
        </p>
      </div>
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default MouseHookPage;
