import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

export default function ResetPassword() {
  const nav = useNavigate();
  const loc = useLocation();

  const nextPath = useMemo(() => {
    const p = new URLSearchParams(loc.search).get("next");
    return p && p.startsWith("/") ? p : "/careers";
  }, [loc.search]);

  const [checking, setChecking] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      // Supabase will read tokens from URL when detectSessionInUrl=true
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setHasRecoverySession(!!data?.session);
      setChecking(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (pw1.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (pw1 !== pw2) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw1 });
      if (error) throw error;

      setMsg("Password updated successfully ✅");
      // Optional: sign out to force fresh sign-in
      await supabase.auth.signOut();
      sessionStorage.removeItem("careers_auth_ok");

      // Go back to auth
      nav(`/careers/auth?next=${encodeURIComponent(nextPath)}`);
    } catch (e2) {
      setErr(e2?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="page">
        <section className="container" style={{ padding: "56px 0", maxWidth: 520 }}>
          <div className="jobCard">
            <div className="jobMuted">Opening reset link…</div>
          </div>
        </section>
      </div>
    );
  }

  if (!hasRecoverySession) {
    return (
      <div className="page">
        <section className="container" style={{ padding: "56px 0", maxWidth: 520 }}>
          <div className="authCard">
            <h1 className="authTitle">Reset link expired</h1>
            <p className="authSub">This reset link is invalid or already used. Please request a new one.</p>
            <button className="authPrimaryBtn" type="button" onClick={() => nav(`/forgot-password?next=${encodeURIComponent(nextPath)}`)}>
              Request new link
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="container" style={{ padding: "56px 0", maxWidth: 520 }}>
        <div className="authCard">
          <h1 className="authTitle">Set a new password</h1>
          <p className="authSub">Choose a strong password and confirm it.</p>

          {err && <div className="authError">{err}</div>}
          {msg && <div className="authSuccess">{msg}</div>}

          <form onSubmit={submit} className="authForm">
            <div className="authField">
              <label>New password</label>
              <input type="password" value={pw1} onChange={(e) => setPw1(e.target.value)} required />
            </div>

            <div className="authField">
              <label>Confirm password</label>
              <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
            </div>

            <button className="authPrimaryBtn" disabled={loading} type="submit">
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
