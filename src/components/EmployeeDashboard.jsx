import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../config/api';
import Logout from './Logout';
import Logo from '../assets/health_care_logo.svg';
import styled from 'styled-components';

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
    const navigate = useNavigate();

    // State for availability slots and appointments
    const [ availabilitySlots, setAvailabilitySlots] = useState([]);
    const [ appointments, setAppointments ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    // New slot form state
    const [ newSlot, setNewSlot ] = useState({
        date: "",
        startTime: "",
        endTime: ""
    });

    // Fetch employee data
    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            setLoading(true);

            // Fetch availibility slots from backend
            const slotsResponse = await api.get('/employee/availability-slots');
            setAvailabilitySlots(slotsResponse.data);

            // Fetch appointments from backend
            const appointmentsResponse = await api.get('/employee/appointments');
            setAppointments(appointmentsResponse.data);

            setError(null);
        } catch (err) {
            setError('Failed to fetch employee data.');
        } finally {
            setLoading(false);
        }
};

    const handleAddAvailability = async (e) => {
        e.preventDefault();
        try {
            // Send new availibility slot to backend
            await api.post('/employee/availability-slots', newSlot);

            // Reset form
            setNewSlot({ date: "", startTime: "", endTime: "" });

            // Refresh availibility slots
            fetchEmployeeData();
        } catch (err) {
            setError('Failed to add availability slot.');
            console.error(err);
        }
    };

    const handleDeleteSlot = async (slotId) => {
        try {
            // Delete availibility slot from backend
            await api.delete(`/employee/availability-slots/${slotId}`);

            // Refresh data
            fetchEmployeeData();
        } catch (err) {
            setError('Failed to delete availability slot.');
            console.error(err);
        }
    };

    if (loading) {
        return <LoadingMessage>Loading...</LoadingMessage>;
    }


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
                {availabilitySlots.length === 0 ? (
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
                            {availabilitySlots.map((slot) => (
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