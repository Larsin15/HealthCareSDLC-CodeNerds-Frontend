function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;

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

  if (!appointment) {
    return (
      <ConfirmationContainer>
        <NoDataMessage>
          <h2>No Booking Information</h2>
          <p>We couldn't find your booking details.</p>
          <PrimaryButton onClick={() => navigate("/user/dashboard")}>
            Go to Dashboard
          </PrimaryButton>
        </NoDataMessage>
      </ConfirmationContainer>
    );
  }

  return (
    <ConfirmationContainer>
      <Card>
        <SuccessIcon>✓</SuccessIcon>
        <Title>Booking Confirmed!</Title>
        <Subtitle>Your appointment has been successfully booked.</Subtitle>

        <DetailsCard>
          <DateTimeBox>
            <DateText>{formatDate(appointment.slotStartTime)}</DateText>
            <TimeText>
              {formatTime(appointment.slotStartTime)} -{" "}
              {formatTime(appointment.slotEndTime)}
            </TimeText>
          </DateTimeBox>

          <DetailRow>
            <DetailLabel>Healthcare Provider</DetailLabel>
            <DetailValue>{appointment.employeeName}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Specialization</DetailLabel>
            <DetailValue>{appointment.employeeSpecialization}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Status</DetailLabel>
            <DetailValue style={{ color: "#057d7a" }}>
              {appointment.status}
            </DetailValue>
          </DetailRow>
          {appointment.notes && (
            <DetailRow>
              <DetailLabel>Your Notes</DetailLabel>
              <DetailValue>{appointment.notes}</DetailValue>
            </DetailRow>
          )}
        </DetailsCard>

        <ButtonGroup>
          <PrimaryButton onClick={() => navigate("/user/dashboard")}>
            View My Appointments
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate("/available-appointments")}>
            Book Another Appointment
          </SecondaryButton>
        </ButtonGroup>

        <InfoBox>
          <InfoTitle>Important Information</InfoTitle>
          <InfoText>
            • You can cancel this appointment up to 24 hours before the scheduled time.
            <br />
            • Please arrive 10 minutes before your appointment.
            <br />
            • If you need to reschedule, please cancel and book a new appointment.
          </InfoText>
        </InfoBox>
      </Card>
    </ConfirmationContainer>
  );
}

export default BookingConfirmation;