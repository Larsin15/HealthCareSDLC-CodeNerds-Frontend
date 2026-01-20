import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";

// Styled components for user dashboard layout
const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LogoContainer = styled.img`
  height: 20rem;
`;

const Title = styled.h2`
  font-size: 22px;
`;

const Text = styled.p`
  font-size: 18px;
`;

// Only accessible to users with the "PATIENT" role
function UserDashboard() {
  const navigate = useNavigate();
  const {
    authState: { user },
  } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:8080/api/appointments/my-appointments",
        { withCredentials: true }
      );
      setAppointments(response.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load your appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContainer>
      <LogoContainer src={Logo} alt="Health Care Logo" />
      <Title>User Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <Logout />
    </UserContainer>
  );
}

export default UserDashboard;
