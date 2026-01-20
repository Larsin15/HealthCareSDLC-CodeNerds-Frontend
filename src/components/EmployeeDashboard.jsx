import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../config/api';
import Logout from './Logout';
import Logo from '../assets/health_care_logo.svg';
import styled from 'styled-components';

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