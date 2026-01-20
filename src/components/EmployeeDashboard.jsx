import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/healthcare_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";

// Styled components for employee dashboard layout
const EmployeeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled.img`
  height: 20rem;
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 10px;
`;

const WelcomeText = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
`;

const Section = styled.section`
  width: 100%;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
`;

const Form = styled.form`
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 18px;
  padding: 40px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 20px;
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
    
    // New slot form state
    const [ newSlot, setNewSlot ] = useState({
        date: "",
        startTime: "",
        endTime: ""
    });

    // Fetch employee data
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
            </Section>
        </DashboardContainer>
    );
}

export default EmployeeDashboard;