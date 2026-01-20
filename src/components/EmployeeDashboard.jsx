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
        <EmployeeContainer>
            <LogoContainer src= {Logo} alt="Health Care Logo" />
            <Title>Employee Dashboard</Title>
            <WelcomeText>Welcome, {user}!</WelcomeText>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {/* Availability Slots Section */}
            <Section>
                <SectionTitle>Manage Availability</SectionTitle>

            {/* Add New Availability Form*/}
            <Form onSubmit={handleAddAvailability}>
                <FormGroup>
                    <Label htmlFor="date">Date:</Label>
                    <Input
                        type="date"
                        id="date"
                        value={newSlot.date}
                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value})}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="startTime">Start Time:</Label>
                    <Input
                        type="time"
                        id="startTime"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value})}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="endTime">End Time:</Label>
                    <Input
                        type="time"
                        id="endTime"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value})}
                        required
                    />
                </FormGroup>
                
                <Button type="submit">Add Availability</Button>

                {/* Existing Availability Slots */}
                <SectionTitle>Existing Availability Slots</SectionTitle>
                {slots.length === 0 ? (
                    <EmptyMessage>No availability slots found.</EmptyMessage>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <Th>Date</Th>
                                <Th>Start Time</Th>
                                <Th>End Time</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {slots.map((slot) => (
                                <tr key={slot.id}>
                                    <Td>{slot.date}</Td>
                                    <Td>{slot.startTime}</Td>
                                    <Td>{slot.endTime}</Td>
                                    <Td>{slot.isBooked ? 'Booked' : 'Available'}</Td>
                                    <Td>
                                        {!slot.isBooked && (
                                            <DeleteButton onClick={() => handleDeleteSlot(slot.id)}>
                                                Delete
                                            </DeleteButton>
                                        )}
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Form>
            </Section>

            {/* Appointments Section */}
            <Section>
                <SectionTitle>My Appointments</SectionTitle>
                {appointments.length === 0 ? (
                    <EmptyMessage>No appointments scheduled.</EmptyMessage>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <Th>Date</Th>
                                <Th>Time</Th>
                                <Th>Patient</Th>
                                <Th>Status</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <Td>{appointment.date}</Td>
                                    <Td>{appointment.time}</Td>
                                    <Td>{appointment.patientName}</Td>
                                    <Td>{appointment.status}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Section>

            <Logout />
        </EmployeeContainer>
    );
}

export default EmployeeDashboard;