

function AvailabilityCalendar() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filters, setFilters] = useState({
    date: "",
    specialization: "",
  });
  // Fetch on component mount
  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:8080/api/availability/available",
        { withCredentials: true }
      );
      setSlots(response.data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      setError("Failed to load available appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSpecializations = () => {
    const specs = [...new Set(slots.map((slot) => slot.employeeSpecialization))];
    return specs.filter(Boolean).sort();
  };

  // Transform filtered slots to calendar events
  const events = filteredSlots.map(slot => ({
    ...slotToCalendarEvent(slot),
    title: `${slot.employeeName} - ${slot.employeeSpecialization}`,
  }));

  // Handle slot selection
  const handleSelectEvent = (event) => {
    const slot = event.resource;
    setSelectedSlot(selectedSlot?.id === slot.id ? null : slot);
  };

  // Handle booking navigation
  const handleBooking = () => {
    if (selectedSlot) {
      navigate("/book-appointment", { state: { slot: selectedSlot } });
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Custom event style getter
  const eventStyleGetter = (event) => {
    const isSelected = selectedSlot?.id === event.resource.id;
    return getEventStyle(event, isSelected);
  };

  // Filter slots based on current filters
  const filteredSlots = slots.filter((slot) => {
    // Date filter
    if (filters.date) {
      const slotDate = new Date(slot.startTime).toISOString().split("T")[0];
      if (slotDate !== filters.date) return false;
    }

    // Specialization filter
    if (filters.specialization) {
      if (slot.employeeSpecialization !== filters.specialization) return false;
    }

    return true;
  });

  // Format date/time for display in selected slot info
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <CalendarContainer>
        <LoadingContainer>Loading available appointments...</LoadingContainer>
      </CalendarContainer>
    );
  }

  return (
    <CalendarContainer>
      <Header>
        <Title>Available Appointments</Title>
        <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
      </Header>
    </CalendarContainer>
  );
}

export default AvailabilityCalendar;
