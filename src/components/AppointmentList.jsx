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
}

export default AppointmentList;