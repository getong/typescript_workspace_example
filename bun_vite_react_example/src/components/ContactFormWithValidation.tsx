import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

function ContactFormWithValidation() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "Email must be valid.";
    }
    return newErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Form submitted successfully!", formData);
      // Reset form or send data
      setFormData({ name: "", email: "" });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ContactFormWithValidation;
