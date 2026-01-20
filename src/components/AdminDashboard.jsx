import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

// Styled components for admin dashboard layout
const AdminContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LogoContainer = styled.img`
  height: 20rem;
`;

const Title = styled.h2`
  font-size: 22px;
`;

const Text = styled.p`
  font-size: 18px;
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
  const [loading, setLoadin] = useState(false);

  const handleInputChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    setError(""); //Clear error on input change
  }










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
