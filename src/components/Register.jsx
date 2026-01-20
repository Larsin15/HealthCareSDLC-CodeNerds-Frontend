import styled from "styled-components";
import { useState } from "react";
import { registerCustomer } from "../api/customerApi";

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Card = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 380px;
  gap: 10px;
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  font-size: 16px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  border-radius: 5px;
  padding: 6px 8px;

  &:focus {
    outline: none;
    border-color: #057d7a;
  }
`;

const ErrorText = styled.span`
  color: #d32f2f;
  font-size: 12px;
`;

const SuccessText = styled.p`
  color: #2e7d32;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-top: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  text-align: center;
  border: none;

  &:hover:enabled {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background-color: #b0b0b0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const GlobalError = styled.p`
  color: #d32f2f;
  font-size: 14px;
`;

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-level error while typing
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setSuccessMessage("");

    const isValid = validate();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerCustomer({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccessMessage("Registration successful! You can now log in.");
      setFormData({
        fullName: "",
        email: "",
        password: "",
      });
      setFieldErrors({});
    } catch (error) {
      // Try to map backend validation errors if available
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data) {
          // Common patterns: { errors: { field: message } } or { message: "" }
          if (data.errors && typeof data.errors === "object") {
            const newFieldErrors = {};
            Object.entries(data.errors).forEach(([field, message]) => {
              newFieldErrors[field] = message;
            });
            setFieldErrors((prev) => ({ ...prev, ...newFieldErrors }));
          }

          if (data.message && !Object.keys(fieldErrors).length) {
            setGlobalError(data.message);
          }
        } else if (data?.message) {
          setGlobalError(data.message);
        } else {
          setGlobalError("Registration failed. Please try again.");
        }
      } else if (error.request) {
        setGlobalError(
          "Unable to reach the server. Please check your connection."
        );
      } else {
        setGlobalError("An unexpected error occurred. Please try again.");
      }
      // eslint-disable-next-line no-console
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Card>
        <Title>Register</Title>

        {globalError && <GlobalError>{globalError}</GlobalError>}
        {successMessage && <SuccessText>{successMessage}</SuccessText>}

        <Form onSubmit={handleSubmit} noValidate>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          {fieldErrors.fullName && (
            <ErrorText>{fieldErrors.fullName}</ErrorText>
          )}

          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {fieldErrors.email && <ErrorText>{fieldErrors.email}</ErrorText>}

          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {fieldErrors.password && (
            <ErrorText>{fieldErrors.password}</ErrorText>
          )}

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </SubmitButton>
        </Form>
      </Card>
    </PageContainer>
  );
}

export default Register;

