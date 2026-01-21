import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

// Styling

// Function
function AvailabilityForm({ onSlotCreated }) {
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour < 16; hour++) {
      options.push(`${hour.toString().padStart(2, "0")}:00`);
      options.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return options;
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const timeOptions = generateTimeOptions();

  const [formData, setFormData] = useState({
    date: "",
    startTime: "09:00",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    let endHours = hours;
    let endMinutes = minutes + 30;

    if (endMinutes >= 60) {
      endHours += 1;
      endMinutes -= 60;
    }

    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const isWeekday = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date) {
      setError("Please select a date.");
      return;
    }

    if (!isWeekday(formData.date)) {
      setError("Slots can only be created on weekdays (Monday-Friday).");
      return;
    }

    const endTime = calculateEndTime(formData.startTime);
    const endHour = parseInt(endTime.split(":")[0]);
    if (endHour > 16 || (endHour === 16 && parseInt(endTime.split(":")[1]) > 0)) {
      setError("Slot must end by 16:00. Please select an earlier start time.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const startDateTime = `${formData.date}T${formData.startTime}:00Z`;
      const endDateTime = `${formData.date}T${endTime}:00Z`;

      await axios.post(
        "http://localhost:8080/api/availability",
        {
          startTime: startDateTime,
          endTime: endDateTime,
        },
        { withCredentials: true }
      );

      setSuccess("Availability slot created successfully!");

      setFormData({
        date: "",
        startTime: "09:00",
      });

      if (onSlotCreated) {
        onSlotCreated();
      }
    } catch (err) {
      console.error("Failed to create slot:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to create availability slot. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const endTime = calculateEndTime(formData.startTime);

    // Return Component
    return (
        <FormContainer>
        <FormTitle>
        </FormTitle>
        </FormContainer>
    );
}

export default AvailabilityForm;
