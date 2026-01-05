// src/components/CareersLayout.jsx  (or src/layouts/CareersLayout.jsx)
// ✅ Fixes:
// - Shows TopBar ONLY when user is signed in AND not on /careers/auth
// - Places TopBar BELOW main Navbar by using CSS positioning (no sticky here)
// - Supports BOTH usages:
//    1) <CareersLayout>{children}</CareersLayout>  (your current pattern)
//    2) <CareersLayout><Outlet/></CareersLayout>   (if you switch to nested routes later)

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopBar from "./TopBar"; // if your TopBar is in src/components/TopBar.jsx
// If TopBar is in src/components, keep "./TopBar" only if CareersLayout is also in components.
// Otherwise change to: import TopBar from "../components/TopBar";

export default function CareersLayout({
  title = "Careers",
  subtitle = "Apply in minutes",
  rightSlot,
  children,
}) {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, loading } = useAuth() || {};

  // ✅ show only after auth loads, only when signed in, and NOT on auth page
  const isAuthPage = loc.pathname.startsWith("/careers/auth");
  const showTopBar = !loading && !!user && !isAuthPage;

  return (
    <div className="careersBg">
      <div className="careersShell">
        {/* ✅ TopBar appears only for signed-in users (and not on auth screen) */}
        {showTopBar && (
          <div style={{ marginBottom: 10 }}>
            <TopBar />
          </div>
        )}

        <div className="careersTopbar">
          <div
            className="careersBrand"
            role="button"
            onClick={() => nav("/careers")}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") nav("/careers");
            }}
          >
            <div className="careersLogo" />
            <div className="careersTitleBlock">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {rightSlot}
          </div>
        </div>

        {/* ✅ Works with current children OR future nested routes */}
        {children ?? <Outlet />}
      </div>
    </div>
  );
}
