import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

// Styling
const FormContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const FormTitle = styled.h3`
  font-size: 20px;
  color: #2c3e50;
  margin: 0 0 20px 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #057d7a;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #057d7a;
  }
`;

const SubmitButton = styled.button`
  padding: 14px 28px;
  background-color: #057d7a;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #2fadaa;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #059669;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
`;

const HelpText = styled.p`
  font-size: 13px;
  color: #7f8c8d;
  margin: 0;
`;

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

  return (
    <FormContainer>
      <FormTitle>Add Availability Slot</FormTitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getMinDate()}
              required
            />
            <HelpText>Weekdays only (Mon-Fri)</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="startTime">Start Time</Label>
            <Select
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
            <HelpText>Working hours: 08:00-16:00</HelpText>
          </FormGroup>

          <FormGroup>
            <Label>End Time</Label>
            <Input type="text" value={endTime} disabled />
            <HelpText>Duration: 30 minutes</HelpText>
          </FormGroup>
        </FormGrid>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Slot"}
        </SubmitButton>
      </form>
    </FormContainer>
  );
}

export default AvailabilityForm;
