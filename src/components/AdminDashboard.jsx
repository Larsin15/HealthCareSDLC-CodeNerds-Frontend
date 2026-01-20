import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

// Styled components for admin dashboard layout
const DashboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LogoContainer = styled.img`
  height: 60px;
`;

const WelcomeText = styled.div`
  h2 {
    font:size: 24px;
    color: #2c3e50;
    margin: 0 0 5px 0;
  }

  p {
    font-size: 14px;
    color: #7f8c8d;
    margin: 0;
  }
`;

const Section = styled.section`
  backround: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
`;

const StyledInput = styled.input`
  font-size: 16px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  border-radius: 8px;
  padding: 12px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #057d7a;
  }
`;

const SubmitButton = styled.button`
  cursor: pointer;
  padding: 14px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  border: none;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #2fadaa;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #059669;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const ErrorMessage = styled.div`¨
  background-color: #fee2e2;
  color: #dc2626;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const InfoBox = styled.div`
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
`;

/**
 * AdminDashboard - Admin only dashboard for employee registration
 * only accessible to users with ADMIN role.
 * Allows admins to create a new employee account only for MVP
 */

function AdminDashboard() {
  const {
    authState: { user },
  } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    employeeNumber: "",
    specialization: "",
    department: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); //Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""), setSuccess("");

    //Basic validations for formData
    if (
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !formData.employeeNumber ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.department ||
      !formData.specialization
    ) {
      setError("Please fill in the required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/register", {
        ...formData,
        roles: ["EMPLOYEE"], //Always register as an employee
      });

      console.log("Employee registration successful:", response.data);
      setSuccess("Employee account created successfully!");

      //Reset form
      setFormData({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        employeeNumber: "",
        specialization: "",
        department: "",
      });
    } catch (error) {
      console.error("Employee registration failed:", error.response || error);
      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to create employee account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContainer>
      <LogoContainer src={Logo} alt="Health Care Logo" />
      <Title>Admin Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <Logout />
    </AdminContainer>
  );
}

export default AdminDashboard;
