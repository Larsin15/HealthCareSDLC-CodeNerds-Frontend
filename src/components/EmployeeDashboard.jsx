import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
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


    
}