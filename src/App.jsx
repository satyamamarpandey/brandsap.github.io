// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import TopBar from "./components/TopBar";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Process from "./pages/Process";
import Pricing from "./pages/Pricing";
import Customers from "./pages/Customers";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";

import JobDetail from "./pages/JobDetail";
import Auth from "./pages/Auth";
import JobApply from "./pages/JobApply";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import InactivityLogout from "./pages/InactivityLogout";

import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const loc = useLocation();
  const { user, loading } = useAuth();

  const onCareers = loc.pathname.startsWith("/careers");
  const showTopBar = onCareers && !loading && !!user;

  return (
    <div className={`app-root ${showTopBar ? "has-topbar" : ""}`}>
      <div className="noise-overlay" aria-hidden="true" />
      <InactivityLogout minutes={10} />

      <ScrollToTop />
      <Navbar />

      {/* ✅ now it will be visible BELOW fixed navbar */}
      {showTopBar ? <TopBar /> : null}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/process" element={<Process />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/careers/:jobId" element={<JobDetail />} />
          <Route path="/careers/auth" element={<Auth />} />
          <Route path="/careers/:jobId/apply" element={<JobApply />} />

          <Route
            path="/careers/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
