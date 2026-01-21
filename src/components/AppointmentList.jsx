import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AppointmentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-left: 4px solid
    ${(props) => {
      switch (props.$status) {
        case "BOOKED":
          return "#057d7a";
        case "CANCELLED":
          return "#dc2626";
        case "COMPLETED":
          return "#6c757d";
        default:
          return "#ddd";
      }
    }};

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AppointmentInfo = styled.div`
  flex: 1;
`;

const DateTime = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
`;

const ProviderInfo = styled.div`
  font-size: 15px;
  color: #34495e;
  margin-bottom: 4px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 8px;
  background-color: ${(props) => {
    switch (props.$status) {
      case "BOOKED":
        return "#e8f5e9";
      case "CANCELLED":
        return "#ffebee";
      case "COMPLETED":
        return "#f5f5f5";
      default:
        return "#f5f5f5";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "BOOKED":
        return "#2e7d32";
      case "CANCELLED":
        return "#c62828";
      case "COMPLETED":
        return "#616161";
      default:
        return "#616161";
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: #dc2626;
  border: 2px solid #dc2626;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #dc2626;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    flex: 1;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  background: #f8f9fa;
  border-radius: 12px;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  margin: 0;
`;

const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  color: #2c3e50;
  margin: 0 0 15px 0;
`;

const ModalText = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0 0 25px 0;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &.confirm {
    background-color: #dc2626;
    color: white;

    &:hover {
      background-color: #b91c1c;
    }
  }

  &.cancel {
    background-color: #f3f4f6;
    color: #374151;

    &:hover {
      background-color: #e5e7eb;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
`;

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
