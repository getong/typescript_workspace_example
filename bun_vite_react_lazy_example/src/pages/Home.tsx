import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import Button from "../components/Button";
import Greeting from "../components/Greeting";

const Home = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Visitor");

  return (
    <div className="container">
      <header>
        <div>
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Home Page</h1>
      </header>

      <Greeting name={name} />

      <div className="card">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="name-input"
        />
        <Button
          label={`count is ${count}`}
          onClick={() => setCount((count) => count + 1)}
        />
        <p>This page is loaded lazily using React.lazy and Suspense</p>
      </div>

      <nav>
        <a href="/about">Go to About</a> | <a href="/contact">Go to Contact</a>
      </nav>
    </div>
  );
};

export default Home;
