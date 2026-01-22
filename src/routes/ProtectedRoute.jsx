import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return null; // or a spinner

  const next = encodeURIComponent(loc.pathname + (loc.search || ""));
  if (!user) return <Navigate to={`/careers/auth?next=${next}`} replace />;

  return children;
}
