// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/SupabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  async function load() {
    if (!user?.id) return;

    setLoading(true);
    setErrMsg("");

    // ✅ Join applications.job_id -> jobs.id
    // IMPORTANT: this requires a FK relationship in Supabase:
    // applications.job_id -> jobs.id
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        id,
        job_id,
        status,
        created_at,
        jobs:job_id (
          id,
          title
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("DASHBOARD apps query error:", error);
      setErrMsg(error.message || "Failed to load applications");
      setApps([]);
      setLoading(false);
      return;
    }

    setApps(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (user?.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div className="dash-wrap">
      <div className="dash-head">
        <h2 className="dash-title">Your Applications</h2>
        <div className="dash-sub">
          Track your submissions and status updates in one place.
        </div>
      </div>

      {loading ? (
        <div className="dash-loading">Loading…</div>
      ) : errMsg ? (
        <div className="dash-error">
          <div className="dash-error-title">Couldn’t load applications</div>
          <div className="dash-error-msg">{errMsg}</div>
          <button className="dash-retry" onClick={load}>
            Retry
          </button>
        </div>
      ) : apps.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-title">No applications yet</div>
          <div className="dash-empty-msg">
            Apply to a role and your submissions will appear here.
          </div>
        </div>
      ) : (
        <div className="apps-grid">
          {apps.map((a) => {
            const title = a?.jobs?.title || "Untitled role";
            const status = (a?.status || "submitted").toLowerCase();
            const applied = a?.created_at
              ? new Date(a.created_at).toLocaleString()
              : "—";

            return (
              <div key={a.id} className="app-card">
                <div className="app-card-top">
                  <div className="app-title-wrap">
                    <div className="app-title">{title}</div>
                    <div className="app-meta">Applied: {applied}</div>
                  </div>

                  <div className={`status-pill status-${status}`}>
                    {a?.status || "submitted"}
                  </div>
                </div>

                {/* Optional: show job_id for debugging (comment out anytime) */}
                {/* <div className="app-debug">Job ID: {a.job_id}</div> */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
