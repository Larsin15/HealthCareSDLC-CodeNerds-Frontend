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

const CalendarWrapper = styled.div`
  min-height: 500px;

  .rbc-calendar {
    height: 500px;
  }
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
  margin-top: 10px;
  width: 100%;

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

const SelectedSlotPanel = styled.div`
  background: linear-gradient(135deg, #fee2e2 0%, #fef3c7 100%);
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  border-left: 4px solid #dc2626;
`;

const SlotPanelTitle = styled.h4`
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const SlotPanelInfo = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 15px 0;
`;

/**
 * EmployeeDashboard - Employee dashboard with appointments and availability management.
 * Only accessible to users with the "EMPLOYEE" role.
 */
function EmployeeDashboard() {
  const {
    authState: { user },
  } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentTab, setAppointmentTab] = useState("upcoming");
  const [slotTab, setSlotTab] = useState("available");
  const [deletingSlotId, setDeletingSlotId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch data on component mount
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
      console.error("Failed to fetch appointments:", err);
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
      console.error("Failed to fetch slots:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Handle slot deletion
  const handleDeleteSlot = async (slotId) => {
    setDeletingSlotId(slotId);
    setError(null);

    try {
      await axios.delete(`http://localhost:8080/api/availability/${slotId}`, {
        withCredentials: true,
      });
      setSelectedSlot(null);
      fetchSlots();
    } catch (err) {
      console.error("Failed to delete slot:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete slot. It may be booked."
      );
    } finally {
      setDeletingSlotId(null);
    }
  };

  // Filter appointments
  const getFilteredAppointments = () => {
    const now = new Date();

    switch (appointmentTab) {
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

  // Filter slots
  const getFilteredSlots = () => {
    switch (slotTab) {
      case "available":
        return slots.filter((slot) => slot.status === "AVAILABLE");
      case "booked":
        return slots.filter((slot) => slot.status === "BOOKED");
      case "all":
      default:
        return slots;
    }
  };

  // Calculate stats
  const stats = {
    totalSlots: slots.length,
    availableSlots: slots.filter((s) => s.status === "AVAILABLE").length,
    bookedSlots: slots.filter((s) => s.status === "BOOKED").length,
    upcomingAppointments: appointments.filter(
      (a) => a.status === "BOOKED" && new Date(a.slotStartTime) >= new Date()
    ).length,
  };

  const filteredAppointments = getFilteredAppointments();
  const filteredSlots = getFilteredSlots();

  // Transform slots to calendar events
  const slotEvents = filteredSlots.map(slot => ({
    ...slotToCalendarEvent(slot),
    title: slot.status,
  }));

  // Handle slot selection in calendar
  const handleSelectSlot = (event) => {
    const slot = event.resource;
    setSelectedSlot(slot);
  };

  // Custom event style getter for slots
  const slotEventStyleGetter = (event) => {
    return getEventStyle(event, selectedSlot?.id === event.resource.id);
  };

  // Format date/time for selected slot panel
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardContainer>
      <Header>
        <LogoSection>
          <LogoContainer src={Logo} alt="Health Care Logo" />
          <WelcomeText>
            <h2>Welcome, {user}!</h2>
            <p>Employee Dashboard - Manage your schedule</p>
          </WelcomeText>
        </LogoSection>
        <Logout />
      </Header>

      {/* Stats Overview */}
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

      {/* Add Availability Form */}
      <AvailabilityForm onSlotCreated={fetchSlots} />

      {/* My Availability Slots */}
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
          <LoadingContainer>Loading slots...</LoadingContainer>
        ) : filteredSlots.length === 0 ? (
          <EmptyState>No slots found in this category.</EmptyState>
        ) : (
          <>
            <CalendarWrapper>
              <Calendar
                localizer={localizer}
                events={slotEvents}
                {...calendarDefaults}
                onSelectEvent={handleSelectSlot}
                eventPropGetter={slotEventStyleGetter}
                selectable={false}
              />
            </CalendarWrapper>

            {selectedSlot && (
              <SelectedSlotPanel>
                <SlotPanelTitle>Selected Slot</SlotPanelTitle>
                <SlotPanelInfo>
                  <strong>Time:</strong> {formatDateTime(selectedSlot.startTime)}
                  <br />
                  <strong>Status:</strong> {selectedSlot.status}
                </SlotPanelInfo>
                {selectedSlot.status === "AVAILABLE" && (
                  <DeleteButton
                    onClick={() => handleDeleteSlot(selectedSlot.id)}
                    disabled={deletingSlotId === selectedSlot.id}
                  >
                    {deletingSlotId === selectedSlot.id ? "Deleting..." : "Delete This Slot"}
                  </DeleteButton>
                )}
                {selectedSlot.status === "BOOKED" && (
                  <SlotPanelInfo style={{ color: '#d97706', fontWeight: '600' }}>
                    This slot is booked and cannot be deleted.
                  </SlotPanelInfo>
                )}
              </SelectedSlotPanel>
            )}
          </>
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
            Upcoming
          </Tab>
          <Tab
            $active={appointmentTab === "past"}
            onClick={() => setAppointmentTab("past")}
          >
            Past
          </Tab>
          <Tab
            $active={appointmentTab === "cancelled"}
            onClick={() => setAppointmentTab("cancelled")}
          >
            Cancelled
          </Tab>
        </TabContainer>

        {loadingAppointments ? (
          <LoadingContainer>Loading appointments...</LoadingContainer>
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
