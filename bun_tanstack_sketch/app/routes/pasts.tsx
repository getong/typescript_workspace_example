import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pasts")({
  component: () => <div>Hello "/posts"!</div>,
});
