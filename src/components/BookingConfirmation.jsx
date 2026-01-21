import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const ConfirmationContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #057d7a 0%, #2fadaa 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  font-size: 40px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #2c3e50;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  margin: 0 0 30px 0;
`;

const DetailsCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #7f8c8d;
  font-size: 14px;
`;

const DetailValue = styled.span`
  color: #2c3e50;
  font-weight: 600;
  font-size: 15px;
`;

const DateTimeBox = styled.div`
  background: linear-gradient(135deg, #057d7a 0%, #2fadaa 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const DateText = styled.div`
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 5px;
`;

const TimeText = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: column;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px 24px;
  background-color: #057d7a;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  padding: 16px 24px;
  background-color: white;
  color: #057d7a;
  border: 2px solid #057d7a;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0fafa;
  }
`;

const InfoBox = styled.div`
  background: #e8f5e9;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  text-align: left;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 8px;
  font-size: 14px;
`;

const InfoText = styled.div`
  color: #4a4a4a;
  font-size: 13px;
  line-height: 1.5;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

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
