import React from "react";
import useMousePosition from "../hooks/useMousePosition";

function ShowMouse() {
  const { x, y } = useMousePosition();

  return (
    <div className="mouse-tracker-container">
      <h2>
        Mouse at ({x}, {y})
      </h2>
      <p>This component uses the useMousePosition custom hook</p>
    </div>
  );
}

export default ShowMouse;
