// src/pages/JobDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient"; // ✅ fixed casing + path

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const isValidId = useMemo(() => UUID_RE.test(String(jobId || "")), [jobId]);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!jobId) return;

    if (!isValidId) {
      setJob(null);
      setLoading(false);
      setErr("Invalid job link.");
      return;
    }

    let ignore = false;

    (async () => {
      try {
        setErr("");
        setLoading(true);

        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .eq("is_active", true)
          .single();

        if (error) throw error;
        if (!ignore) setJob(data);
      } catch (e) {
        if (!ignore) setErr(e?.message || "Failed to load job");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [jobId, isValidId]);

  const applyNow = async () => {
    if (!isValidId) {
      navigate("/careers");
      return;
    }

    // ✅ Fast auth check
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      navigate(`/careers/auth?next=/careers/${jobId}/apply`);
      return;
    }

    navigate(`/careers/${jobId}/apply`);
  };

  return (
    <div className="page">
      <section className="container" style={{ padding: "48px 0" }}>
        <button
          type="button"
          className="jobBack"
          onClick={() => navigate("/careers")}
        >
          ← Back to Careers
        </button>

        {loading && (
          <div className="jobCard" style={{ marginTop: 16 }}>
            <div className="jobMuted">Loading job…</div>
          </div>
        )}

        {!loading && err && (
          <div className="jobCard" style={{ marginTop: 16 }}>
            <div className="jobTitle">
              {err === "Invalid job link."
                ? "Invalid job link"
                : "Couldn’t load job"}
            </div>
            <div className="jobMuted" style={{ marginTop: 8 }}>
              {err}
            </div>
          </div>
        )}

        {!loading && !err && job && (
          <div className="jobDetail" style={{ marginTop: 16 }}>
            <div className="jobDetailHeader">
              <div>
                <h1 className="jobH1">{job.title}</h1>
                <div className="jobMeta">
                  <span>{job.location}</span>
                  <span className="dot">•</span>
                  <span>{job.department}</span>
                  <span className="dot">•</span>
                  <span>{job.level}</span>
                </div>
              </div>

              <div className="jobHeaderRight">
                <span className="jobPill">{job.type}</span>
                <button
                  type="button"
                  className="jobBtnPrimary"
                  onClick={applyNow}
                >
                  Apply now
                </button>
              </div>
            </div>

            <div className="jobSection">
              <h3 className="jobSectionTitle">About the role</h3>
              <p className="jobParagraph">{job.description}</p>
            </div>

            <div className="jobTwoCol">
              <div className="jobSection">
                <h3 className="jobSectionTitle">Responsibilities</h3>
                <ul className="jobList">
                  {(job.responsibilities || []).map((x, idx) => (
                    <li key={idx}>{x}</li>
                  ))}
                </ul>
              </div>

              <div className="jobSection">
                <h3 className="jobSectionTitle">Requirements</h3>
                <ul className="jobList">
                  {(job.requirements || []).map((x, idx) => (
                    <li key={idx}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="jobFooterCta">
              <button
                type="button"
                className="jobBtnPrimary"
                onClick={applyNow}
              >
                Apply now
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
