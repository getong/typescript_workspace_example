import CounterComponent from "../components/CounterComponent";

function CounterPage() {
  return (
    <div className="counter-page">
      <h2>Counter Demo</h2>
      <CounterComponent />
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default CounterPage;
