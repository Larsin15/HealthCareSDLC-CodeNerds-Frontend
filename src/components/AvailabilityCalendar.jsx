import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { Calendar } from 'react-big-calendar';
import { localizer, calendarDefaults, slotToCalendarEvent, getEventStyle } from '../config/calendarConfig';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';

// Styled components for the availability calendar
const CalendarContainer = styled.div`
  max-width: 1200px;
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

const FilterSection = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  min-width: 180px;

  &:focus {
    outline: none;
    border-color: #057d7a;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  min-width: 180px;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #057d7a;
  }
`;

const CalendarWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-height: 600px;

  .rbc-calendar {
    height: 600px;
  }
`;

const SelectedSlotInfo = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f9ff 100%);
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  border-left: 4px solid #057d7a;
`;

const SlotInfoTitle = styled.h4`
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-weight: 600;
`;

const SlotInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #7f8c8d;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 16px;
  color: #2c3e50;
  font-weight: 500;
`;

const BookButton = styled.button`
  width: 100%;
  padding: 14px 24px;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
`;

const EmptyText = styled.p`
  font-size: 18px;
  margin: 0;
`;

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

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <FilterSection>
        <FilterGroup>
          <FilterLabel htmlFor="date-filter">Filter by Date</FilterLabel>
          <FilterInput
            id="date-filter"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="spec-filter">Filter by Specialization</FilterLabel>
          <FilterSelect
            id="spec-filter"
            name="specialization"
            value={filters.specialization}
            onChange={handleFilterChange}
          >
            <option value="">All Specializations</option>
            {getSpecializations().map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
      </FilterSection>

      {filteredSlots.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📅</EmptyIcon>
          <EmptyText>
            {slots.length === 0
              ? "No available appointments at this time."
              : "No appointments match your filters."}
          </EmptyText>
        </EmptyState>
      ) : (
        <>
          <CalendarWrapper>
            <Calendar
              localizer={localizer}
              events={events}
              {...calendarDefaults}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              selectable={false}
            />
          </CalendarWrapper>

          {selectedSlot && (
            <SelectedSlotInfo>
              <SlotInfoTitle>Selected Appointment</SlotInfoTitle>
              <SlotInfoGrid>
                <InfoItem>
                  <InfoLabel>Date & Time</InfoLabel>
                  <InfoValue>{formatDateTime(selectedSlot.startTime)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Healthcare Provider</InfoLabel>
                  <InfoValue>{selectedSlot.employeeName}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Specialization</InfoLabel>
                  <InfoValue>{selectedSlot.employeeSpecialization}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Duration</InfoLabel>
                  <InfoValue>30 minutes</InfoValue>
                </InfoItem>
              </SlotInfoGrid>
              <BookButton onClick={handleBooking}>
                Book This Appointment
              </BookButton>
            </SelectedSlotInfo>
          )}

          {!selectedSlot && (
            <SelectedSlotInfo style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)', borderLeft: '4px solid #bdc3c7' }}>
              <SlotInfoTitle>How to Book</SlotInfoTitle>
              <InfoValue style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Click on any appointment slot in the calendar above to select it and see booking details.
              </InfoValue>
            </SelectedSlotInfo>
          )}
        </>
      )}
    </CalendarContainer>
  );
}

export default AvailabilityCalendar;
