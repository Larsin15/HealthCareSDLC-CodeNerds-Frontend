

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
