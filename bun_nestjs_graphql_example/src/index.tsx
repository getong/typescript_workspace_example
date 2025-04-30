import React from "react";
import { createRoot } from "react-dom/client";
import GraphqlClient from "./client/GraphqlClient";

// Find or create a container element
const container =
  document.getElementById("root") || document.createElement("div");
if (!container.id) {
  container.id = "root";
  document.body.appendChild(container);
}

// Ensure the container is not null
if (!container) {
  throw new Error("Failed to initialize the root container.");
}

// Create root and render the app
const root = createRoot(container);
root.render(<GraphqlClient />);
