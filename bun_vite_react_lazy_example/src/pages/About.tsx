const About = () => {
  return (
    <div className="container">
      <h1>About Page</h1>
      <div className="content">
        <p>This is the about page.</p>
        <p>
          This component is lazily loaded, which means it's only fetched from
          the server when the user navigates to the /about route.
        </p>
        <p>
          Using React.lazy() and Suspense improves the initial load time by only
          loading the necessary code for the current view.
        </p>
      </div>
      <nav>
        <a href="/">Go to Home</a> |<a href="/contact">Go to Contact</a>
      </nav>
    </div>
  );
};

export default About;
