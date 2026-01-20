import styled from "styled-components";
import Logo from "../assets/health_care_logo.svg";
import { Link } from "react-router-dom";

// Styled components for home page layout
const HomeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 28px;
`;

// Styled Link component that looks like a button
// Using Link instead of div improves accessibility and semantic HTML
const PrimaryButton = styled(Link)`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-top: 3rem;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const SecondaryButton = styled(Link)`
  cursor: pointer;
  padding: 8px 24px;
  background-color: #ffffff;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #057d7a;
  margin-top: 1rem;
  text-decoration: none;
  border: 2px solid #057d7a;
  transition: background-color 0.3s ease, color 0.3s ease,
    transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: #e0f4f3;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const LogoContainer = styled.img`
  height: 20rem;
`;

const Home = () => (
  <HomeContainer>
    <LogoContainer src={Logo} alt="Health Care Logo" />
    <Title>Health Care Appointment App</Title>
    <PrimaryButton to="/login">Login</PrimaryButton>
    <SecondaryButton to="/register">Register</SecondaryButton>
  </HomeContainer>
);

export default Home;
