import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Get the root element from the HTML
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Mount React app
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

console.log("React Hook Form Basic Example is running!");
