// src/pages/Apply.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

export default function Apply() {
  const nav = useNavigate();
  const loc = useLocation();
  const { jobId } = useParams(); // uuid in your table

  // file picker ref
  const resumeInputRef = useRef(null);

  const nextAfterAuth = useMemo(() => {
    const here = loc.pathname + (loc.search || "");
    return `/careers/auth?next=${encodeURIComponent(here)}`;
  }, [loc.pathname, loc.search]);

  const [sessionUser, setSessionUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // application row
  const [appId, setAppId] = useState(null);
  const [status, setStatus] = useState("draft"); // draft | submitted

  // form fields (ALL REQUIRED)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // resume
  // mode: attach | manual
  const [resumeMode, setResumeMode] = useState("attach");
  const [resumeFile, setResumeFile] = useState(null);

  // stored fields (DB)
  // NOTE: you are storing *storage path* in resume_url for attach
  // for manual mode, we also store the manual link/text into resume_url to satisfy NOT NULL constraint
  const [resumePath, setResumePath] = useState(""); // storage path (attach)
  const [resumeFilename, setResumeFilename] = useState("");
  const [resumeMime, setResumeMime] = useState("");
  const [resumeSize, setResumeSize] = useState(null);
  const [resumeText, setResumeText] = useState(""); // manual text/link

  // preview (signed url)
  const [resumePreviewUrl, setResumePreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  const [err, setErr] = useState("");

  const resumeAccept =
    ".pdf,.doc,.docx,.txt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const clean = (v) => (v || "").trim();
  const cleanEmail = (v) => clean(v).toLowerCase();

  const isHttpUrl = (v) => {
    const s = clean(v);
    return /^https?:\/\/.+/i.test(s);
  };

  const validateRequired = () => {
    if (!clean(fullName)) return "Full name is required.";
    if (!clean(email)) return "Email is required.";
    if (!clean(phone)) return "Phone is required.";
    if (!clean(linkedin)) return "LinkedIn is required.";
    if (!isHttpUrl(linkedin)) return "LinkedIn must start with http:// or https://";
    if (!clean(portfolio)) return "Portfolio is required.";
    if (!isHttpUrl(portfolio)) return "Portfolio must start with http:// or https://";
    if (!clean(coverLetter)) return "Cover letter is required.";

    const r = validateResume();
    if (r) return r;

    return "";
  };

  const validateResume = () => {
    if (resumeMode === "attach") {
      // either already uploaded (resumePath) or just picked (resumeFile)
      if (!resumePath && !resumeFile) return "Please attach your resume.";
      if (resumeFile && resumeFile.size > 5 * 1024 * 1024) return "Resume file must be 5MB or smaller.";
      return "";
    }

    // manual
    if (!clean(resumeText)) return "Please paste your resume link/text.";
    return "";
  };

  // 1) session + load existing application (draft/submitted)
  useEffect(() => {
    let mounted = true;

    (async () => {
      setCheckingSession(true);

      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user || null;

      if (!mounted) return;

      setSessionUser(user);

      if (!user) {
        setCheckingSession(false);
        nav(nextAfterAuth, { replace: true });
        return;
      }

      // Prefill from auth user
      const metaName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.given_name ||
        "";

      setEmail(user.email || "");
      setFullName(metaName || "");

      // Load existing application row for (user_id, job_id)
      try {
        const { data: row, error: selErr } = await supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .eq("job_id", jobId)
          .maybeSingle();

        if (selErr) throw selErr;

        if (row) {
          setAppId(row.id);
          setStatus(row.status || "draft");

          setFullName(row.full_name || metaName || "");
          setEmail(row.email || user.email || "");
          setPhone(row.phone || "");
          setLinkedin(row.linkedin || "");
          setPortfolio(row.portfolio || "");
          setCoverLetter(row.cover_letter || "");

          setResumePath(row.resume_url || ""); // (attach: storage path) (manual: stored link/text)
          setResumeFilename(row.resume_filename || "");
          setResumeMime(row.resume_mime || "");
          setResumeSize(row.resume_size ?? null);
          setResumeText(row.resume_text || "");

          // choose mode based on what exists
          if (row.resume_text && !row.resume_filename) setResumeMode("manual");
          else setResumeMode("attach");
        }
      } catch (e) {
        setErr(e?.message || "Failed to load application.");
      } finally {
        setCheckingSession(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setSessionUser(user);
      setCheckingSession(false);

      if (!user) nav(nextAfterAuth, { replace: true });
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [nav, nextAfterAuth, jobId]);

  // 2) Create signed preview URL when we have a stored resumePath (attach-only)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setResumePreviewUrl("");

      // only create signed URL for storage paths (attach mode)
      if (!resumePath) return;
      if (!sessionUser) return;

      // If user is in manual mode, resumePath might be a URL/text; don't try to sign it
      if (resumeMode === "manual") return;

      try {
        const { data, error } = await supabase.storage.from("resumes").createSignedUrl(resumePath, 60 * 60);
        if (error) throw error;
        if (!cancelled) setResumePreviewUrl(data?.signedUrl || "");
      } catch {
        if (!cancelled) setResumePreviewUrl("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resumePath, sessionUser, resumeMode]);

  const signOut = async () => {
    setErr("");
    setInfoMsg("");
    setLoading(true);
    try {
      await supabase.auth.signOut();
      sessionStorage.removeItem("careers_auth_ok");
      nav("/careers/auth?next=/careers", { replace: true });
    } catch (e) {
      setErr(e?.message || "Sign out failed");
    } finally {
      setLoading(false);
    }
  };

  // clean UX: click "Attach" = opens picker
  const onPickResumeMode = (mode) => {
    setErr("");
    setInfoMsg("");
    setResumeMode(mode);

    if (mode === "attach") {
      // switching to attach: clear manual
      setResumeText("");
      setTimeout(() => resumeInputRef.current?.click?.(), 0);
    } else {
      // switching to manual: clear file selection, keep stored upload until they overwrite if you want
      setResumeFile(null);
      setResumePreviewUrl("");
    }
  };

  // 3) Upload resume immediately when user selects file
  const onResumeFileChosen = async (file) => {
    setErr("");
    setInfoMsg("");
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErr("Resume file must be 5MB or smaller.");
      return;
    }

    if (!sessionUser) {
      setErr("Session expired. Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${sessionUser.id}/${jobId}/${Date.now()}_${safeName}`;

      const { error: upErr } = await supabase.storage
        .from("resumes")
        .upload(path, file, { upsert: true, contentType: file.type || "application/octet-stream" });

      if (upErr) throw upErr;

      setResumeFile(file);

      // store metadata in state (autosave will persist)
      setResumePath(path);
      setResumeFilename(file.name);
      setResumeMime(file.type || "");
      setResumeSize(file.size);

      setInfoMsg("Resume uploaded.");
    } catch (e) {
      setErr(e?.message || "Resume upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // helper: value to store in DB.resume_url (must NOT be null in your table)
  const resumeUrlForDb = () => {
    if (resumeMode === "attach") return resumePath || ""; // storage path or empty (draft)
    return clean(resumeText) || ""; // manual link/text
  };

  // 4) Autosave draft (debounced)
  useEffect(() => {
    if (!sessionUser) return;
    if (!jobId) return;
    if (checkingSession) return;

    // stop autosave after submit (safer)
    if (status === "submitted") return;

    const t = setTimeout(async () => {
      setSavingDraft(true);
      setErr("");

      try {
        // IMPORTANT:
        // - Keep NOT NULL columns non-null by using "" (empty string) for text, and 0/null for ints.
        // - resume_url must not be null in your DB, so we always provide string ("" or value).
        const payload = {
          user_id: sessionUser.id,
          job_id: jobId,

          status: "draft",

          full_name: clean(fullName) || "",
          email: cleanEmail(email) || "",
          phone: clean(phone) || "",
          linkedin: clean(linkedin) || "",
          portfolio: clean(portfolio) || "",
          cover_letter: clean(coverLetter) || "",

          // resume fields
          resume_url: resumeUrlForDb(), // NEVER null
          resume_filename: resumeMode === "attach" ? (resumeFilename || "") : "",
          resume_mime: resumeMode === "attach" ? (resumeMime || "") : "",
          resume_size: resumeMode === "attach" ? (resumeSize ?? null) : null,

          resume_text: resumeMode === "manual" ? (clean(resumeText) || "") : "",
        };

        const { data, error } = await supabase
          .from("applications")
          .upsert(payload, { onConflict: "user_id,job_id" }) // ✅ lock 1 app per job per user (requires unique index)
          .select("id,status")
          .single();

        if (error) throw error;
        if (data?.id) setAppId(data.id);
      } catch (e) {
        setErr(e?.message || "Autosave failed.");
      } finally {
        setSavingDraft(false);
      }
    }, 900);

    return () => clearTimeout(t);
  }, [
    sessionUser,
    jobId,
    checkingSession,
    status,
    fullName,
    email,
    phone,
    linkedin,
    portfolio,
    coverLetter,
    resumeMode,
    resumePath,
    resumeFilename,
    resumeMime,
    resumeSize,
    resumeText,
  ]);

  // 5) Submit: updates status to submitted (same row)
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setInfoMsg("");

    if (!sessionUser) {
      setErr("Session expired. Please sign in again.");
      return;
    }

    if (status === "submitted") {
      setInfoMsg("You already submitted this application.");
      return;
    }

    // ✅ enforce ALL required fields
    const v = validateRequired();
    if (v) {
      setErr(v);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: sessionUser.id,
        job_id: jobId,

        status: "submitted",

        full_name: clean(fullName),
        email: cleanEmail(email),
        phone: clean(phone),
        linkedin: clean(linkedin),
        portfolio: clean(portfolio),
        cover_letter: clean(coverLetter),

        // resume fields
        resume_url: resumeUrlForDb(), // NEVER null
        resume_filename: resumeMode === "attach" ? resumeFilename : "",
        resume_mime: resumeMode === "attach" ? resumeMime : "",
        resume_size: resumeMode === "attach" ? (resumeSize ?? null) : null,

        resume_text: resumeMode === "manual" ? clean(resumeText) : "",
      };

      const { data, error } = await supabase
        .from("applications")
        .upsert(payload, { onConflict: "user_id,job_id" })
        .select("id,status")
        .single();

      if (error) throw error;

      setAppId(data?.id || null);
      setStatus("submitted");
      setInfoMsg("Application submitted successfully.");
    } catch (e2) {
      setErr(e2?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="page">
        <section className="container" style={{ padding: "56px 0", maxWidth: 980 }}>
          <div className="applyWrap">
            <div className="jobMuted">Checking session…</div>
          </div>
        </section>
      </div>
    );
  }

  const showPdfPreview = resumePreviewUrl && (resumeMime || "").toLowerCase().includes("pdf");

  return (
    <div className="page">
      <section className="container" style={{ padding: "28px 0 96px", maxWidth: 980 }}>
        <div className="applyWrap">
          {/* Header */}
          <div className="applyHeader" style={{ gap: 12 }}>
            <div>
              <h1 style={{ margin: 0 }}>Apply</h1>
              <div className="jobMuted" style={{ marginTop: 8 }}>
                Signed in as <strong>{sessionUser?.email}</strong>
                {savingDraft && <span style={{ marginLeft: 10, opacity: 0.75 }}>• Saving…</span>}
                {!savingDraft && status === "draft" && <span style={{ marginLeft: 10, opacity: 0.75 }}>• Draft</span>}
                {status === "submitted" && <span style={{ marginLeft: 10, opacity: 0.75 }}>• Submitted</span>}
              </div>
            </div>

            <button type="button" className="jobBack applySignOut" onClick={signOut} disabled={loading} title="Sign out">
              {loading ? "Signing out…" : "Sign out"}
            </button>
          </div>

          {infoMsg && (
            <div className="authSuccess" style={{ marginTop: 16 }}>
              {infoMsg}
            </div>
          )}
          {err && (
            <div className="authError" style={{ marginTop: 16 }}>
              {err}
            </div>
          )}

          <form onSubmit={submit} style={{ marginTop: 18 }}>
            <div className="applyGrid">
              <div className="authField">
                <label>Full name *</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={status === "submitted"}
                />
              </div>

              <div className="authField">
                <label>Email *</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "submitted"}
                />
              </div>

              <div className="authField">
                <label>Phone *</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={status === "submitted"}
                />
              </div>

              <div className="authField">
                <label>LinkedIn *</label>
                <input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  required
                  disabled={status === "submitted"}
                />
              </div>

              <div className="authField">
                <label>Portfolio</label>
                <input
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://..."
                  disabled={status === "submitted"}
                />
              </div>

              <div className="authField applySpan2">
                <label>Why do you think you're a good fit for this role?*</label>
                <textarea
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're a good fit…"
                  required
                  disabled={status === "submitted"}
                />
              </div>

              {/* Resume */}
              <div className="applySpan2">
                <div style={{ fontWeight: 800, marginBottom: 8 }}>Resume/CV *</div>

                <div className="resumeOptions">
                  <button
                    type="button"
                    className={`resumeOptBtn ${resumeMode === "attach" ? "isActive" : ""}`}
                    onClick={() => onPickResumeMode("attach")}
                    disabled={status === "submitted"}
                    title="Upload a file"
                  >
                    Attach
                  </button>

                  <button
                    type="button"
                    className={`resumeOptBtn ${resumeMode === "manual" ? "isActive" : ""}`}
                    onClick={() => onPickResumeMode("manual")}
                    disabled={status === "submitted"}
                    title="Paste link or text"
                  >
                    Enter manually
                  </button>
                </div>

                <div style={{ marginTop: 12, color: "rgba(255,255,255,.72)", fontSize: 14 }}>
                  Accepted: pdf, doc, docx, txt, rtf (max 5MB)
                </div>

                {/* hidden picker */}
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept={resumeAccept}
                  style={{ display: "none" }}
                  onChange={(e) => onResumeFileChosen(e.target.files?.[0] || null)}
                />

                {resumeMode === "attach" && (
                  <div className="resumeBox" style={{ marginTop: 14 }}>
                    <div className="resumeMeta">
                      {resumeFilename ? (
                        <>
                          <strong>{resumeFilename}</strong>
                          {resumeSize ? <span> • {(resumeSize / 1024 / 1024).toFixed(2)} MB</span> : null}
                        </>
                      ) : (
                        <span>No file selected (required)</span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="jobBack"
                        onClick={() => resumeInputRef.current?.click?.()}
                        disabled={loading || status === "submitted"}
                      >
                        {resumeFilename ? "Change" : "Upload"}
                      </button>

                      {resumeFilename && status !== "submitted" && (
                        <button
                          type="button"
                          className="jobBack"
                          onClick={() => {
                            setResumeFile(null);
                            setResumePath("");
                            setResumeFilename("");
                            setResumeMime("");
                            setResumeSize(null);
                            setResumePreviewUrl("");
                            if (resumeInputRef.current) resumeInputRef.current.value = "";
                          }}
                          disabled={loading}
                        >
                          Remove
                        </button>
                      )}

                      {resumePreviewUrl && (
                        <a className="jobBack" href={resumePreviewUrl} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      )}
                    </div>

                    {/* Preview */}
                    {resumePreviewUrl && (
                      <div style={{ marginTop: 14 }}>
                        {showPdfPreview ? (
                          <div
                            style={{
                              border: "1px solid rgba(255,255,255,.12)",
                              borderRadius: 14,
                              overflow: "hidden",
                            }}
                          >
                            <iframe
                              title="Resume preview"
                              src={resumePreviewUrl}
                              style={{ width: "100%", height: 520, border: 0 }}
                            />
                          </div>
                        ) : (
                          <div className="jobMuted" style={{ marginTop: 6 }}>
                            Preview works best for PDF. For DOC/DOCX, use <strong>Open</strong>.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {resumeMode === "manual" && (
                  <div className="resumeBox" style={{ marginTop: 14 }}>
                    <div className="authField">
                      <label>Paste resume link or text *</label>
                      <textarea
                        rows={5}
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume text or a link (https://...)"
                        required
                        disabled={status === "submitted"}
                      />
                      {clean(resumeText) && isHttpUrl(resumeText) && (
                        <div style={{ marginTop: 10 }}>
                          <a className="jobBack" href={clean(resumeText)} target="_blank" rel="noreferrer">
                            Open link
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile-friendly sticky actions */}
            <div
              className="applyActions"
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "14px 16px",
                backdropFilter: "blur(10px)",
                background: "rgba(0,0,0,.45)",
                borderTop: "1px solid rgba(255,255,255,.12)",
                display: "flex",
                justifyContent: "center",
                zIndex: 50,
              }}
            >
              <div style={{ width: "min(980px, 100%)", display: "flex", gap: 12 }}>
                <button
                  className="authPrimaryBtn"
                  type="submit"
                  disabled={loading || status === "submitted"}
                  style={{ flex: 1 }}
                >
                  {status === "submitted" ? "Submitted" : loading ? "Submitting…" : "Submit application"}
                </button>

                <button
                  type="button"
                  className="jobBack"
                  onClick={() => nav("/careers")}
                  disabled={loading}
                  style={{ minWidth: 120 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          {/* spacer so content isn't hidden behind sticky bar */}
          <div style={{ height: 90 }} />
        </div>
      </section>
    </div>
  );
}
