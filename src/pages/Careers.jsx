// src/pages/Careers.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setErr("");
        setLoading(true);

        const { data, error } = await supabase
          .from("jobs")
          .select("id,title,department,level,type,location")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (!ignore) setJobs(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setErr(e?.message || "Failed to load jobs");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const openJob = (jobId) => navigate(`/careers/${jobId}`);

  // ✅ Forces safe left/right spacing on phones + keeps desktop nice
  const contentWrapStyle = {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    paddingLeft: "clamp(16px, 4vw, 24px)",
    paddingRight: "clamp(16px, 4vw, 24px)",
  };

  return (
    <div className="page careersPage">
      {/* ✅ REMOVE container from section and use our wrapper so padding always works */}
      <section className="careersSection">
        <div style={contentWrapStyle}>
          <div className="careersTop">
            <div className="careersPill">CAREERS</div>
            <h1 className="careersH1">Join the team shaping Brandsap.</h1>
            <p className="careersSub">Current job openings at Brandsap.</p>
          </div>

          {loading && (
            <div className="jobCard wipe-ltr">
              <div className="jobMuted">Loading jobs…</div>
            </div>
          )}

          {!loading && err && (
            <div className="jobCard wipe-ltr">
              <div className="jobTitle">Couldn’t load jobs</div>
              <div className="jobMuted" style={{ marginTop: 8 }}>
                {err}
              </div>
            </div>
          )}

          {!loading && !err && jobs.length === 0 && (
            <div className="jobCard wipe-ltr">
              <div className="jobMuted">No openings right now.</div>
            </div>
          )}

          {!loading && !err && jobs.length > 0 && (
            <div className="jobGrid wipe-group">
              {jobs.map((j) => (
                <div key={j.id} className="jobCard wipe-ltr">
                  <div className="jobTop">
                    <h3 className="jobTitle">{j.title}</h3>
                    <span className="jobPill">{j.type}</span>
                  </div>

                  <div className="jobMuted">{j.location}</div>
                  <div className="jobMuted">
                    {j.department} • {j.level}
                  </div>

                  <div className="jobActions">
                    <button
                      type="button"
                      className="jobBtn"
                      onClick={() => openJob(j.id)}
                    >
                      View &amp; Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
