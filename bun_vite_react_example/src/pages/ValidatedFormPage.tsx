import ContactFormWithValidation from "../components/ContactFormWithValidation";

function ValidatedFormPage() {
  return (
    <div className="contact-page">
      <h2>Validated Contact Form</h2>
      <p>Form with validation using React state</p>
      <div className="form-container">
        <ContactFormWithValidation />
      </div>
      <div className="back-link">
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default ValidatedFormPage;
