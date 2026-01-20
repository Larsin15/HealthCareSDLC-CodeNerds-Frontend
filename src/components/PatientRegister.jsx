import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Styled components for registration page layout
const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
`;

const RegisterButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-top: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  text-align: center;
  border: none;
  width: 100%;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const Title = styled.h2`
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 20px;
  text-align: center;
`;

const FormWrapper = styled.form`
  padding: 40px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  gap: 15px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
`;

const StyledInput = styled.input`
  font-size: 16px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  border-radius: 5px;
  padding: 10px;

  &:focus {
    outline: none;
    border-color: #057d7a;
  }
`;

const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #059669;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #666;

  a {
    color: #057d7a;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

/**
 * PatientRegister - Patient self-registration form
 * Allows patients to create their own accounts
 */
function PatientRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear error on input change
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.username || !formData.password || !formData.email) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        {
          ...formData,
          roles: ["PATIENT"], // Always register as PATIENT
        }
      );

      console.log("Registration successful:", response.data);
      setSuccess("Registration successful! Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error.response || error);
      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <Title>Patient Registration</Title>
      <Subtitle>Create your account to book appointments</Subtitle>

      <FormWrapper onSubmit={handleRegister} aria-label="Patient registration form">
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <StyledLabel htmlFor="username">Username *</StyledLabel>
          <StyledInput
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            required
            autoComplete="username"
          />
        </FormGroup>

        <FormGroup>
          <StyledLabel htmlFor="password">Password *</StyledLabel>
          <StyledInput
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            autoComplete="new-password"
          />
        </FormGroup>

        <FormGroup>
          <StyledLabel htmlFor="email">Email *</StyledLabel>
          <StyledInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            autoComplete="email"
          />
        </FormGroup>

        <FormRow>
          <FormGroup>
            <StyledLabel htmlFor="firstName">First Name</StyledLabel>
            <StyledInput
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              autoComplete="given-name"
            />
          </FormGroup>

          <FormGroup>
            <StyledLabel htmlFor="lastName">Last Name</StyledLabel>
            <StyledInput
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              autoComplete="family-name"
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <StyledLabel htmlFor="phoneNumber">Phone Number</StyledLabel>
          <StyledInput
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+46701234567"
            autoComplete="tel"
          />
        </FormGroup>

        <FormGroup>
          <StyledLabel htmlFor="dateOfBirth">Date of Birth</StyledLabel>
          <StyledInput
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            autoComplete="bday"
          />
        </FormGroup>

        <RegisterButton type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </RegisterButton>

        <LoginLink>
          Already have an account? <Link to="/login">Login here</Link>
        </LoginLink>
      </FormWrapper>
    </RegisterContainer>
  );
}

export default PatientRegister;


