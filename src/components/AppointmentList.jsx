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
}

export default AppointmentList;