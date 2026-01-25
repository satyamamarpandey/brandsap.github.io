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
  sessionStorage.removeItem("careers_auth_ok");
  nav("/careers/auth?next=/careers", { replace: true });
}

  return (
    <div className="topbar topbar--auth">
  <div className="topbar-left topbar__left">
    <span className="topbar-hi topbar__hi">
      Signed in as <b className="topbar__name">{displayName || "Account"}</b>
    </span>

    <div className="topbar-links topbar__links">
      <Link className="topbar-link topbar__link" to={backTo}>
        <span className="labelLong">Back to Jobs</span>
        <span className="labelShort">Jobs</span>
      </Link>

      <Link className="topbar-link topbar__link" to="/careers/dashboard">
        <span className="labelLong">Dashboard</span>
        <span className="labelShort">Dash</span>
      </Link>
    </div>
  </div>

  <div className="topbar-right topbar__right">
    <button className="topbar-btn topbar-btn--sm topbar__signout" onClick={onSignOut}>
      <span className="labelLong">Sign out</span>
      <span className="labelShort">Out</span>
    </button>
  </div>
</div>

  );
}
