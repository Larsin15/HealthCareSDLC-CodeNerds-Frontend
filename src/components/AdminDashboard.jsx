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
