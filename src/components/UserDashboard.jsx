import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";
import AppointmentList from "./AppointmentList";

// Styled components for user dashboard layout
const DashboardContainer = styled.div`
  max-width: 900px;
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
    font-size: 24px;
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
  background: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
`;

const BookButton = styled.button`
  padding: 12px 24px;
  background-color: #057d7a;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-2px);
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 10px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  background: ${(props) => (props.$active ? "#057d7a" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#666")};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? "#057d7a" : "#f0f0f0")};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const ActionCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 2px solid #ecf0f1;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #057d7a;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(5, 125, 122, 0.15);
  }
`;

const ActionIcon = styled.span`
  font-size: 32px;
  margin-bottom: 10px;
`;

const ActionText = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
`;

/**
 * UserDashboard - Patient dashboard with appointments and booking functionality.
 * Only accessible to users with the "PATIENT" role.
 */
function UserDashboard() {
  const navigate = useNavigate();
  const {
    authState: { user },
  } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:8080/api/appointments/my-appointments",
        { withCredentials: true }
      );
      setAppointments(response.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load your appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on active tab
  const getFilteredAppointments = () => {
    const now = new Date();

    switch (activeTab) {
      case "upcoming":
        return appointments.filter(
          (apt) =>
            apt.status === "BOOKED" && new Date(apt.slotStartTime) >= now
        );
      case "past":
        return appointments.filter(
          (apt) =>
            apt.status === "COMPLETED" ||
            (apt.status === "BOOKED" && new Date(apt.slotEndTime) < now)
        );
      case "cancelled":
        return appointments.filter((apt) => apt.status === "CANCELLED");
      default:
        return appointments;
    }
  };

  // Handle successful cancellation
  const handleCancelSuccess = () => {
    fetchAppointments();
  };

  // Navigate to booking page
  const handleBookAppointment = () => {
    navigate("/available-appointments");
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <DashboardContainer>
      <Header>
        <LogoSection>
          <LogoContainer src={Logo} alt="Health Care Logo" />
          <WelcomeText>
            <h2>Welcome, {user}!</h2>
            <p>Manage your healthcare appointments</p>
          </WelcomeText>
        </LogoSection>
        <Logout />
      </Header>

      {/* Quick Actions Section */}
      <Section>
        <SectionTitle style={{ marginBottom: "20px" }}>Quick Actions</SectionTitle>
        <QuickActions>
          <ActionCard onClick={handleBookAppointment}>
            <ActionIcon>📅</ActionIcon>
            <ActionText>Book New Appointment</ActionText>
          </ActionCard>
          <ActionCard onClick={() => setActiveTab("upcoming")}>
            <ActionIcon>⏰</ActionIcon>
            <ActionText>View Upcoming</ActionText>
          </ActionCard>
          <ActionCard onClick={() => setActiveTab("past")}>
            <ActionIcon>📋</ActionIcon>
            <ActionText>View History</ActionText>
          </ActionCard>
        </QuickActions>
      </Section>

      {/* Appointments Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>My Appointments</SectionTitle>
          <BookButton onClick={handleBookAppointment}>
            + Book Appointment
          </BookButton>
        </SectionHeader>

        <TabContainer>
          <Tab
            $active={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </Tab>
          <Tab
            $active={activeTab === "past"}
            onClick={() => setActiveTab("past")}
          >
            Past
          </Tab>
          <Tab
            $active={activeTab === "cancelled"}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled
          </Tab>
        </TabContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading ? (
          <LoadingContainer>Loading your appointments...</LoadingContainer>
        ) : (
          <AppointmentList
            appointments={filteredAppointments}
            onCancelSuccess={handleCancelSuccess}
            showPatientName={false}
          />
        )}
      </Section>
    </DashboardContainer>
  );
}

export default UserDashboard;
