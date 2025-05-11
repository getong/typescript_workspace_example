import useWindowWidth from "../hooks/useWindowWidth";

function ResponsiveComponent() {
  const width = useWindowWidth();

  return (
    <div className="responsive-container">
      <h1>Window Width: {width}px</h1>
      {width > 768 ? <p>Desktop View</p> : <p>Mobile View</p>}
    </div>
  );
}

export default ResponsiveComponent;
