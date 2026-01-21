import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";
import AppointmentList from "./AppointmentList";
import AvailabilityForm from "./AvailabilityForm";
import { Calendar } from 'react-big-calendar';
import { localizer, calendarDefaults, slotToCalendarEvent, getEventStyle } from '../config/calendarConfig';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';

// Styled components for employee dashboard layout
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const StatCard = styled.div`
  background: linear-gradient(
    135deg,
    ${(props) => props.$bgStart || "#f8f9fa"} 0%,
    ${(props) => props.$bgEnd || "#ffffff"} 100%
  );
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${(props) => props.$color || "#2c3e50"};
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #7f8c8d;
`;

const SlotsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SlotCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid
    ${(props) => {
      switch (props.$status) {
        case "AVAILABLE":
          return "#10b981";
        case "BOOKED":
          return "#f59e0b";
        case "CANCELLED":
          return "#ef4444";
        default:
          return "#6b7280";
      }
    }};
`;

const SlotInfo = styled.div`
  flex: 1;
`;

const SlotDateTime = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
`;

const SlotStatus = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(props) => {
    switch (props.$status) {
      case "AVAILABLE":
        return "#d1fae5";
      case "BOOKED":
        return "#fef3c7";
      case "CANCELLED":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "AVAILABLE":
        return "#059669";
      case "BOOKED":
        return "#d97706";
      case "CANCELLED":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  }};
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  background-color: white;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #dc2626;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  background: #f8f9fa;
  border-radius: 12px;
`;

// Only accessible to users with the "EMPLOYEE" role
function EmployeeDashboard() {
    const {
        authState: { user },
    } = useAuth();

    // State for availability slots and appointments
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [error, setError] = useState(null);
    const [appointmentTab, setAppointmentTab] = useState("upcoming");
    const [slotTab, setSlotTab] = useState("available");
    const [deletingSlotId, setDeletingSlotId] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    
    useEffect(() => {
        fetchAppointments();
        fetchSlots();
    }, []);

    const fetchAppointments = async () => {
        setLoadingAppointments(true);
        try {
            const response = await axios.get(
                "http://localhost:8080/api/appointments/employee-appointments",
                { withCredentials: true }
            );
            setAppointments(response.data);
        } catch (err) {
            console.error("Error fetching appointments:", err);
        } finally {
            setLoadingAppointments(false);
        }
};
    const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
            const response = await axios.get(
                "http://localhost:8080/api/availability/my-slots",
                { withCredentials: true }
            );
            setSlots(response.data);
        } catch (err) {
            console.error("Error fetching availability slots:", err);
        } finally {
            setLoadingSlots(false);
        }
    };


    const handleAddAvailability = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            // Combine date and time into ISO datetime strings
            const startDateTime = `${newSlot.date}T${newSlot.startTime}:00`;
            const endDateTime = `${newSlot.date}T${newSlot.endTime}:00`;

            await axios.post(
                "http://localhost:8080/api/availability",
                {
                    startTime: startDateTime,
                    endTime: endDateTime,
                },
                { withCredentials: true }
            );
                
            // Reset form
            setNewSlot({ date: "", startTime: "", endTime: "" });

            // refresh slots
            fetchSlots();
        } catch (err) {
            setError('Failed to add availability slot.');
            console.error(err);
        }
    };

    const handleDeleteSlot = async (slotId) => {
        setDeletingSlotId(slotId);
        setError(null);
        try {
            await axios.delete(
                `http://localhost:8080/api/availability/${slotId}`,
                { withCredentials: true }
            );

            // Refresh slots
            fetchSlots();
        } catch (err) {
            setError(err.response?.data?.message || "failed to delete slot.");
            console.error("Error deleting slot:", err);
        } finally {
            setDeletingSlotId(null);
        }
    };


    return (
        <DashboardContainer>
            <Header>
                <LogoSection>
                    <LogoContainer src={Logo} alt="Health Care Logo" />
                    <WelcomeText>
                        <h2>Welcome, {user}!</h2>
                        <p>Employee Dashboard - Mange your schedule</p>
                    </WelcomeText>
                </LogoSection>
            </Header>

            {/* Stats overview */}
            <StatsGrid>
                <StatCard $bgStart="#e8f5e9" $bgEnd="#f1f8e9">
                    <StatNumber $color="#2e7d32">{stats.availableSlots}</StatNumber>
                    <StatLabel>Available Slots</StatLabel>
                </StatCard>

                <StatCard $bgStart="#fff3e0" $bgEnd="#fff8e1">
                    <StatNumber $color="#ef6c00">{stats.bookedSlots}</StatNumber>
                    <StatLabel>Booked Slots</StatLabel>
                </StatCard>

                <StatCard $bgStart="#e3f2fd" $bgEnd="#e8f4fd">
                    <StatNumber $color="#1565c0">{stats.upcomingAppointments}</StatNumber>
                    <StatLabel>Upcoming Appointments</StatLabel>
                </StatCard>

                <StatCard $bgStart="#f3e5f5" $bgEnd="#fce4ec">
                    <StatNumber $color="#7b1fa2">{stats.totalSlots}</StatNumber>
                    <StatLabel>Total Slots</StatLabel>
                </StatCard>
            </StatsGrid>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            {/* Add availability forms */}
            <AvailabilityForm onSlotCreated={fetchSlots} />

            {/* My Availability slots */}
            <Section style={{ marginTop: "25px" }}>
                <SectionHeader>
                    <SectionTitle>My Availability Slots</SectionTitle>
                </SectionHeader>

            <TabContainer>
                <Tab
                    $active={slotTab === "available"}
                    onClick={() => setSlotTab("available")}
                >
                    Available ({stats.availableSlots})
                </Tab>

                <Tab
                    $active={slotTab === "booked"}
                    onClick={() => setSlotTab("booked")}
                >
                    Booked ({stats.bookedSlots})
                </Tab>
                
                <Tab $active={slotTab === "all"} onClick={() => setSlotTab("all")}>
                    All ({stats.totalSlots})
                </Tab>
            </TabContainer>

            {loadingSlots ? (
                <LoadingContainer>Loading...</LoadingContainer>
            ) : filteredSlots.length === 0 ? (
                <EmptyState>No slots found in this category</EmptyState>
            ) : (
                <SlotsList>
                    {filteredSlots.map((slot) => (
                        <SlotCard key={slot.id} $status={slot.status}>
                            <SlotInfo>
                                <SlotDateTime>
                                    {formatDate(slot.startTime)} | {formatTime(slot.startTime)}(" ")
                                    - {formatTime(slot.endTime)}
                                </SlotDateTime>
                                <SlotStatus $status={slot.status}>(slot.status)</SlotStatus>
                            </SlotInfo>
                            {slot.status === "AVAILABLE" && (
                                <DeleteButton
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    disabled={deletingSlotId === slot.id}
                                >
                                    {deletingSlotId === slot.id ? "Deleting..." : "Delete"}
                                </DeleteButton>
                            )}
                        </SlotCard>
                    ))}
                </SlotsList>
            )}
            </Section>

            {/* My Appointments */}
            <Section>
                <SectionHeader>
                    <SectionTitle>My Appointments</SectionTitle>
                </SectionHeader>

                <TabContainer>
                    <Tab
                        $active={appointmentTab === "upcoming"}
                        onClick={() => setAppointmentTab("upcoming")}
                    >
                        Upcoming ({stats.upcomingAppointments})
                    </Tab>

                    <Tab
                        $active={appointmentTab === "past"}
                        onClick={() => setAppointmentTab("past")}
                    >
                        Past ({stats.pastAppointments})
                    </Tab>

                    <Tab
                        $active={appointmentTab === "cancelled"}
                        onClick={() => setAppointmentTab("cancelled")}
                    >
                        Cancelled ({stats.cancelledAppointments})
                    </Tab>
                </TabContainer>

                {loadingAppointments ? (
                    <LoadingContainer>Loading...</LoadingContainer>
                ) : (
                    <AppointmentList
                        appointments={filteredAppointments}
                        onCancelSuccess={fetchAppointments}
                        showPatientName={true}
                    />
                )}
            </Section>
        </DashboardContainer>
    );
}

export default EmployeeDashboard;