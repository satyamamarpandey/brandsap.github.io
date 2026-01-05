// src/pages/JobPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient"; // <-- change casing if needed

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function JobPage() {
  const { jobId } = useParams();
  const nav = useNavigate();

  const nextAuthUrl = useMemo(() => {
    return `/careers/auth?next=/careers/${jobId}/apply`;
  }, [jobId]);

  const isValidId = useMemo(() => UUID_RE.test(String(jobId || "")), [jobId]);

  const [job, setJob] = useState(null);
  const [me, setMe] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [resume, setResume] = useState(null);

  const [app, setApp] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
  });

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setErr("");
        setMsg("");
        setLoading(true);

        // ✅ invalid URL -> go back
        if (!jobId || !isValidId) {
          nav("/careers");
          return;
        }

        // ✅ Gate: force user to pass Auth page each time
        const gate = sessionStorage.getItem("careers_auth_ok");
        if (!gate) {
          nav(nextAuthUrl);
          return;
        }

        // ✅ Supabase auth
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) {
          sessionStorage.removeItem("careers_auth_ok");
          nav(nextAuthUrl);
          return;
        }

        // ✅ Load job from Supabase
        const { data: jobData, error: jobErr } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .eq("is_active", true)
          .single();

        if (jobErr) throw jobErr;

        if (ignore) return;

        setJob(jobData);

        // ✅ “me” data (from Supabase auth)
        const fullName =
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          "";
        const email = user?.email || "";

        setMe({ email, name: fullName });

        setApp((p) => ({
          ...p,
          fullName: p.fullName || fullName,
          email: p.email || email,
        }));
      } catch (e) {
        if (!ignore) setErr(e?.message || "Failed to load page");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [jobId, isValidId, nav, nextAuthUrl]);

  const onPickResume = (file) => {
    setErr("");
    setMsg("");

    if (!file) {
      setResume(null);
      return;
    }

    const okTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!okTypes.includes(file.type)) {
      setErr("Resume must be PDF, DOC, or DOCX.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErr("Resume must be under 5 MB.");
      return;
    }

    setResume(file);
  };

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);

    try {
      if (!resume) {
        throw new Error("Please upload your resume.");
      }

      // ✅ Must be logged in (again)
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        sessionStorage.removeItem("careers_auth_ok");
        nav(nextAuthUrl);
        return;
      }

      // ✅ Upload resume to Supabase Storage bucket: "resumes"
      const safeName = resume.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = `public/${jobId}/${Date.now()}_${Math.random()
        .toString(16)
        .slice(2)}_${safeName}`;

      const { data: up, error: upErr } = await supabase.storage
        .from("resumes")
        .upload(filePath, resume, {
          cacheControl: "3600",
          upsert: false,
          contentType: resume.type,
        });

      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("resumes").getPublicUrl(up.path);
      const resumeUrl = pub?.publicUrl;

      if (!resumeUrl) throw new Error("Could not generate resume URL.");

      // ✅ Insert application into Supabase table: "applications"
      // Make sure columns match your table!
      const { error: insErr } = await supabase.from("applications").insert({
        job_id: jobId,
        user_id: user.id, // keep if your table has it (recommended)
        full_name: app.fullName.trim(),
        email: app.email.trim().toLowerCase(),
        phone: app.phone.trim(),
        linkedin: app.linkedin?.trim() || null,
        portfolio: app.portfolio?.trim() || null,
        cover_letter: app.coverLetter?.trim() || null,

        resume_url: resumeUrl,
        resume_filename: resume.name,
        resume_mime: resume.type,
        resume_size: resume.size,
      });

      if (insErr) throw insErr;

      setMsg("Application submitted successfully ✅");

      // Optional: require auth gate again next time
      sessionStorage.removeItem("careers_auth_ok");
    } catch (e2) {
      setErr(e2?.message || "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ padding: "48px 0" }}>
          <div className="jobCard">
            <div className="jobMuted">Loading…</div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page">
        <div className="container" style={{ padding: "48px 0" }}>
          <div className="jobCard">
            <div className="jobTitle">Job not found</div>
            <div className="jobMuted" style={{ marginTop: 8 }}>
              {err || "This job may be inactive or removed."}
            </div>
            <div style={{ marginTop: 14 }}>
              <button className="jobBtn" onClick={() => nav("/careers")}>
                Back to Careers
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];

  return (
    <main className="page">
      <section className="container twoCol" style={{ padding: "48px 0" }}>
        <div className="card">
          <button type="button" className="jobBack" onClick={() => nav(`/careers/${jobId}`)}>
            ← Back to job
          </button>

          <h1 style={{ marginTop: 12 }}>{job.title}</h1>
          <p className="muted">
            {job.location} • {job.type} • {job.level}
          </p>

          {err && <div className="authError" style={{ marginTop: 12 }}>{err}</div>}
          {msg && <div className="authSuccess" style={{ marginTop: 12 }}>{msg}</div>}

          <h3 style={{ marginTop: 18 }}>About the role</h3>
          <p>{job.description}</p>

          <h3>Responsibilities</h3>
          <ul>
            {responsibilities.map((x, i) => <li key={i}>{x}</li>)}
          </ul>

          <h3>Requirements</h3>
          <ul>
            {requirements.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>

        <div className="card">
          <h2>Apply now</h2>
          <p className="muted">Signed in as {me?.email || "—"}</p>

          <form className="form" onSubmit={submit}>
            <label>
              Full name *
              <input
                value={app.fullName}
                onChange={(e) => setApp({ ...app, fullName: e.target.value })}
                required
              />
            </label>

            <label>
              Email *
              <input
                type="email"
                value={app.email}
                onChange={(e) => setApp({ ...app, email: e.target.value })}
                required
              />
            </label>

            <label>
              Phone *
              <input
                value={app.phone}
                onChange={(e) => setApp({ ...app, phone: e.target.value })}
                required
              />
            </label>

            <label>
              LinkedIn
              <input
                value={app.linkedin}
                onChange={(e) => setApp({ ...app, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </label>

            <label>
              Portfolio / Website
              <input
                value={app.portfolio}
                onChange={(e) => setApp({ ...app, portfolio: e.target.value })}
                placeholder="https://..."
              />
            </label>

            <label>
              Cover letter
              <textarea
                rows={6}
                value={app.coverLetter}
                onChange={(e) => setApp({ ...app, coverLetter: e.target.value })}
              />
            </label>

            <label>
              Resume (PDF/DOC/DOCX, max 5MB) *
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => onPickResume(e.target.files?.[0])}
                required
              />
              {resume && (
                <div className="muted" style={{ marginTop: 6 }}>
                  Selected: {resume.name} • {(resume.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </label>

            <button className="btnPrimary" disabled={busy}>
              {busy ? "Submitting…" : "Submit application"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
