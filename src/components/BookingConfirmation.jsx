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
}

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

export default BookingConfirmation;