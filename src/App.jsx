import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Unauthorized from "./components/Unauthorized";
import Home from "./components/Home";
import RequireAuth from "./components/RequireAuth";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import BookingForm from "./components/BookingForm";
import BookingConfirmation from "./components/BookingConfirmation";
import GlobalStyle from "./styles/GlobalStyle";

// AuthProvider must wrap Router to ensure auth state is available to all routes
function App() {
  return (
    <AuthProvider>
      <GlobalStyle />
      <div className="content">
        <Router>
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Patient routes - require PATIENT role */}
            <Route
              path="/user/dashboard"
              element={
                <RequireAuth allowedRoles={["PATIENT", "USER"]}>
                  <UserDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/available-appointments"
              element={
                <RequireAuth allowedRoles={["PATIENT", "USER"]}>
                  <AvailabilityCalendar />
                </RequireAuth>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <RequireAuth allowedRoles={["PATIENT", "USER"]}>
                  <BookingForm />
                </RequireAuth>
              }
            />
            <Route
              path="/booking-confirmation"
              element={
                <RequireAuth allowedRoles={["PATIENT", "USER"]}>
                  <BookingConfirmation />
                </RequireAuth>
              }
            />

            {/* Employee routes - require EMPLOYEE role */}
            <Route
              path="/employee/dashboard"
              element={
                <RequireAuth allowedRoles={["EMPLOYEE"]}>
                  <EmployeeDashboard />
                </RequireAuth>
              }
            />

            {/* Admin routes - require ADMIN role */}
            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />

            {/* Fallback route - redirects unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;