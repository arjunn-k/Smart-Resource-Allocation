import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HospitalPortal from "./pages/HospitalPortal";
import NgoAdminPortal from "./pages/NgoAdminPortal";
import PublicPortal from "./pages/PublicPortal";
import VolunteerPortal from "./pages/VolunteerPortal";
import VolunteerProfile from "./pages/VolunteerProfile";
import VolunteerSignUpForm from "./components/VolunteerSignUpForm";
import NGOApplicationForm from "./components/NGOApplicationForm";
import HospitalRegistrationForm from "./components/HospitalRegistrationForm";
import RoleBasedLogin from "./pages/RoleBasedLogin";
import { DispatchProvider } from "./context/DispatchContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const pageTransition = {
  initial: { opacity: 0, y: 14, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(8px)" },
  transition: { duration: 0.45, ease: "easeOut" },
};

function AnimatedPage({ children }) {
  return <motion.div {...pageTransition}>{children}</motion.div>;
}

export default function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <AuthProvider>
        <DispatchProvider>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Landing - Unprotected and Full Page */}
              <Route
                path="/"
                element={
                  <AnimatedPage>
                    <PublicPortal />
                  </AnimatedPage>
                }
              />

              {/* NGO Admin Route - Protected */}
              <Route
                path="/ngo-admin"
                element={
                  <ProtectedRoute allowedRoles={["ngoAdmin"]}>
                    <DashboardLayout>
                      <AnimatedPage>
                        <NgoAdminPortal />
                      </AnimatedPage>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Hospital Portal Route - Protected */}
              <Route
                path="/hospital-crisis"
                element={
                  <ProtectedRoute allowedRoles={["hospitalStaff"]}>
                    <DashboardLayout>
                      <AnimatedPage>
                        <HospitalPortal />
                      </AnimatedPage>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Volunteer Routes - Protected */}
              <Route
                path="/volunteer-dispatch"
                element={
                  <ProtectedRoute allowedRoles={["volunteer"]}>
                    <DashboardLayout>
                      <AnimatedPage>
                        <VolunteerPortal />
                      </AnimatedPage>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/volunteer-profile"
                element={
                  <ProtectedRoute allowedRoles={["volunteer"]}>
                    <DashboardLayout>
                      <AnimatedPage>
                        <VolunteerProfile />
                      </AnimatedPage>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Standalone Volunteer Sign Up Route */}
              <Route
                path="/volunteer-signup"
                element={
                  <AnimatedPage>
                    <VolunteerSignUpForm />
                  </AnimatedPage>
                }
              />
              
              {/* New NGO Partnership Application Route */}
              <Route
                path="/ngo-apply"
                element={
                  <AnimatedPage>
                    <NGOApplicationForm />
                  </AnimatedPage>
                }
              />
              
              {/* New Hospital Verification Application Route */}
              <Route
                path="/hospital-apply"
                element={
                  <AnimatedPage>
                    <HospitalRegistrationForm />
                  </AnimatedPage>
                }
              />
              
              {/* Dynamic Role-Based Login */}
              <Route
                path="/login"
                element={
                  <AnimatedPage>
                    <RoleBasedLogin />
                  </AnimatedPage>
                }
              />
            </Routes>
          </AnimatePresence>
        </DispatchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Trigger Vite HMR reload
