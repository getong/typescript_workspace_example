import ContactForm from "../components/ContactForm";

function ContactPage() {
  return (
    <div className="contact-page">
      <h2>Contact Form</h2>
      <p>Demonstrating a React form with useState</p>
      <div className="form-container">
        <ContactForm />
      </div>
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default ContactPage;
