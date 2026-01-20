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
};