import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

// Styling

// Functions
function AvailabilityForm() {
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 8; hour < 16; hour++) {
            options.push(`${hour.toString().padStart(2, '0')}:00`);
            options.push(`${hour.toString().padStart(2, '0')}:30`);
        }
    return options;
    }

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const timeOptions = generateTimeOptions();

    const [ formData, setFormData ] = useState({
        date: '',
        startTime: "09:00"
    });
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(null);
    };

    const calculateEndTime = (startTime) => {
        const [hour, minutes] = startTime.split(':').map(Number);
        let endHours = 1;
        let endMinutes = minutes + 30;

        if (endMinutes >= 60) {
            endHours += 1;
            endMinutes -= 60;
        }

        return `${(hour + endHours).toString().padStart(2, '0')}:${endMinutes
            .toString()
            .padStart(2, '0')}`;
        };

        const isWeekDay = (dateString) => {
            const date = new Date(dateString);
            const day = date.getDay();
            return day !== 0 && day !== 6;
        };

        const handleSubmit = async (e) => {
        e.preventDefault();

        





















}

// Returned Component