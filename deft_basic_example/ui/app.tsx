import "./app.css";
import { Container } from "deft-react";
import React from "react";

class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.error("error catch", error);
  }
  render() {
    // @ts-ignore
    return this.props.children;
  }
}

function MyApp() {
  return <Container className="main">Welcome to Your Deft App</Container>;
}

export function App() {
  return (
    <ErrorBoundary>
      <MyApp />
    </ErrorBoundary>
  );
}
