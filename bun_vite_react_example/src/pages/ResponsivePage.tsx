import ResponsiveComponent from "../components/ResponsiveComponent";

function ResponsivePage() {
  return (
    <div className="responsive-page">
      <h2>Responsive Demo</h2>
      <p>Demonstrating the useWindowWidth hook</p>
      <div className="responsive-demo">
        <ResponsiveComponent />
        <p className="instruction">Try resizing your browser window!</p>
      </div>
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default ResponsivePage;
