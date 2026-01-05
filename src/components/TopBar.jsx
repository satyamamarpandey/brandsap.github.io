// src/components/TopBar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, displayName } = useAuth();

  if (!user) return null;

  // If user is already on careers pages, back goes to /careers
  const backTo = loc.pathname.startsWith("/careers") ? "/careers" : "/careers";

  async function onSignOut() {
    await supabase.auth.signOut();
    nav("/careers", { replace: true });
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="topbar-hi">
          Signed in as <b>{displayName || "Account"}</b>
        </span>

        <Link className="topbar-link" to={backTo}>
          Back to Jobs
        </Link>

        <Link className="topbar-link" to="/careers/dashboard">
          Dashboard
        </Link>
      </div>

      <button className="topbar-btn topbar-btn--sm" onClick={onSignOut}>
        Sign out
      </button>
    </div>
  );
}
