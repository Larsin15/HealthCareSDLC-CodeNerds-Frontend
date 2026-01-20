import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const slot = location.state?.slot;

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const handleCancel = () => {
    navigate("/available-appointments");
  };

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