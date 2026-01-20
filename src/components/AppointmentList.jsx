function AppointmentList({
  appointments = [],
  onCancelSuccess,
  showPatientName = false,
}) {
  const [cancellingId, setCancellingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE", {
      weekday: "short",
      year: "numeric",
      month: "short",
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

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowConfirmModal(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setSelectedAppointment(null);
    setError(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;

    setCancellingId(selectedAppointment.id);
    setError(null);

    try {
      await axios.delete(
        `http://localhost:8080/api/appointments/${selectedAppointment.id}`,
        { withCredentials: true }
      );

      handleCloseModal();

      // Call success callback to refresh the list
      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (err) {
      console.error("Cancel failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to cancel appointment. Please try again.";
      setError(errorMessage);
    } finally {
      setCancellingId(null);
    }
  };

  if (appointments.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📅</EmptyIcon>
        <EmptyText>No appointments found.</EmptyText>
      </EmptyState>
    );
  }

  return (
    <>
      <ListContainer>
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} $status={appointment.status}>
            <AppointmentInfo>
              <DateTime>
                {formatDate(appointment.slotStartTime)} at{" "}
                {formatTime(appointment.slotStartTime)} -{" "}
                {formatTime(appointment.slotEndTime)}
              </DateTime>
              {showPatientName ? (
                <ProviderInfo>Patient: {appointment.patientName}</ProviderInfo>
              ) : (
                <ProviderInfo>
                  {appointment.employeeName} - {appointment.employeeSpecialization}
                </ProviderInfo>
              )}
              <StatusBadge $status={appointment.status}>
                {appointment.status}
              </StatusBadge>
            </AppointmentInfo>

            <ActionButtons>
              {appointment.canCancel && appointment.status === "BOOKED" && (
                <CancelButton
                  onClick={() => handleCancelClick(appointment)}
                  disabled={cancellingId === appointment.id}
                >
                  {cancellingId === appointment.id ? "Cancelling..." : "Cancel"}
                </CancelButton>
              )}
            </ActionButtons>
          </AppointmentCard>
        ))}
      </ListContainer>

      {/* Cancel Confirmation Modal */}
      {showConfirmModal && selectedAppointment && (
        <ConfirmModal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Cancel Appointment?</ModalTitle>
            <ModalText>
              Are you sure you want to cancel your appointment on{" "}
              <strong>{formatDate(selectedAppointment.slotStartTime)}</strong> at{" "}
              <strong>{formatTime(selectedAppointment.slotStartTime)}</strong>?
              <br />
              <br />
              This action cannot be undone.
            </ModalText>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ModalButtons>
              <ModalButton
                className="cancel"
                onClick={handleCloseModal}
                disabled={cancellingId}
              >
                Keep Appointment
              </ModalButton>
              <ModalButton
                className="confirm"
                onClick={handleConfirmCancel}
                disabled={cancellingId}
              >
                {cancellingId ? "Cancelling..." : "Yes, Cancel"}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmModal>
      )}
    </>
  );
}

export default AppointmentList;