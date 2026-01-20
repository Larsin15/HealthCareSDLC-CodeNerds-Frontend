import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

// Styled components for booking form
const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #2c3e50;
  margin: 0;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #ecf0f1;
`;

const AppointmentDetails = styled.div`
  display: grid;
  gap: 15px;
  margin-bottom: 30px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #7f8c8d;
  font-size: 14px;
`;

const DetailValue = styled.span`
  color: #2c3e50;
  font-weight: 600;
  font-size: 16px;
`;

const DateTimeHighlight = styled.div`
  background: linear-gradient(135deg, #057d7a 0%, #2fadaa 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 25px;
`;

const HighlightDate = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
  opacity: 0.9;
`;

const HighlightTime = styled.div`
  font-size: 32px;
  font-weight: 700;
`;

const NotesSection = styled.div`
  margin-bottom: 25px;
`;

const NotesLabel = styled.label`
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
`;

const NotesInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #057d7a;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 25px;
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 16px 24px;
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

const CancelButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  background-color: white;
  color: #6c757d;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    border-color: #6c757d;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingText = styled.div`
  font-size: 18px;
  color: #057d7a;
  font-weight: 500;
`;

const NoSlotMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

/**
 * BookingForm component for confirming an appointment booking.
 * Displays slot details and allows patient to confirm the booking.
 */
function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const slot = location.state?.slot;

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!slot) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/appointments",
        {
          availabilitySlotId: slot.id,
          notes: notes.trim() || null,
        },
        { withCredentials: true }
      );

      // Navigate to confirmation page with appointment data
      navigate("/booking-confirmation", {
        state: { appointment: response.data },
        replace: true,
      });
    } catch (err) {
      console.error("Booking failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to book appointment. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/available-appointments");
  };

  // If no slot data, show message
  if (!slot) {
    return (
      <FormContainer>
        <NoSlotMessage>
          <h2>No Appointment Selected</h2>
          <p>Please select an appointment from the available slots.</p>
          <ConfirmButton onClick={() => navigate("/available-appointments")}>
            View Available Appointments
          </ConfirmButton>
        </NoSlotMessage>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      {loading && (
        <LoadingOverlay>
          <LoadingText>Booking your appointment...</LoadingText>
        </LoadingOverlay>
      )}

      <Header>
        <Title>Confirm Booking</Title>
        <BackButton onClick={handleCancel}>← Back</BackButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Card>
        <DateTimeHighlight>
          <HighlightDate>{formatDate(slot.startTime)}</HighlightDate>
          <HighlightTime>
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </HighlightTime>
        </DateTimeHighlight>

        <SectionTitle>Appointment Details</SectionTitle>

        <AppointmentDetails>
          <DetailRow>
            <DetailLabel>Healthcare Provider</DetailLabel>
            <DetailValue>{slot.employeeName}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Specialization</DetailLabel>
            <DetailValue>{slot.employeeSpecialization}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Duration</DetailLabel>
            <DetailValue>30 minutes</DetailValue>
          </DetailRow>
        </AppointmentDetails>

        <NotesSection>
          <NotesLabel htmlFor="notes">
            Notes for the healthcare provider (optional)
          </NotesLabel>
          <NotesInput
            id="notes"
            placeholder="Add any information you'd like to share before your appointment..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
          />
        </NotesSection>

        <ButtonGroup>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <ConfirmButton onClick={handleConfirmBooking} disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </ConfirmButton>
        </ButtonGroup>
      </Card>
    </FormContainer>
  );
}

export default BookingForm;




