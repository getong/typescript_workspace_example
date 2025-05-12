import React, { useState } from "react";

// This component intentionally throws an error when count reaches 5
function BuggyCounter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  if (count === 5) {
    // Simulate an error when count reaches 5
    throw new Error("I crashed when count reached 5!");
  }

  return (
    <div className="buggy-counter">
      <h3>Buggy Counter Example</h3>
      <p>Current Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <p className="instruction">The counter will crash when it reaches 5</p>
    </div>
  );
}

export default BuggyCounter;
