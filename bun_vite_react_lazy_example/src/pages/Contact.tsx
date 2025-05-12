const Contact = () => {
  return (
    <div className="container">
      <h1>Contact Page</h1>
      <div className="content">
        <p>This is the contact page.</p>
        <p>
          This component demonstrates dynamic code splitting with React Router
          and lazy loading.
        </p>
        <form>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="Your email" />
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea id="message" placeholder="Your message"></textarea>
          </div>
          <button type="submit">Send</button>
        </form>
      </div>
      <nav>
        <a href="/">Go to Home</a> |<a href="/about">Go to About</a>
      </nav>
    </div>
  );
};

export default Contact;
