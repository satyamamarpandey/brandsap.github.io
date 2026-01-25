import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

export default function ResetPassword() {
  const nav = useNavigate();
  const loc = useLocation();

  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const nextPath = useMemo(() => {
    const p = new URLSearchParams(loc.search).get("next");
    return p && p.startsWith("/") ? p : "/careers/auth";
  }, [loc.search]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!mounted) return;
      setErr("");
      setMsg("");

      // 1) If Supabase already has a session (e.g. URL already processed)
      const { data: s1, error: e1 } = await supabase.auth.getSession();
      if (!mounted) return;

      if (e1) {
        setErr(e1.message || "Unable to validate reset link.");
        setReady(true);
        return;
      }

      if (s1?.session) {
        setReady(true);
        return;
      }

      // 2) Implicit flow: pull session from URL (hash tokens) and store it
      const { data, error } = await supabase.auth.getSessionFromUrl({
        storeSession: true,
      });

      if (!mounted) return;

      if (error || !data?.session) {
        setErr(error?.message || "Reset link is invalid or expired. Please request a new one.");
        setReady(true);
        return;
      }

      setReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (pw.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    if (pw !== pw2) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;

      setMsg("Password updated. Redirecting…");
      setTimeout(() => nav(nextPath), 700);
    } catch (e2) {
      setErr(e2?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page authPage">
      <section className="container authWrap">
        <div className="authCard">
          <h1 className="authTitle">Reset password</h1>
          <p className="authSub">Enter a new password to finish resetting your account.</p>

          {err && <div className="authError">{err}</div>}
          {msg && <div className="authSuccess">{msg}</div>}

          {!ready && !err && <div className="authMuted">Validating reset link…</div>}

          {ready && !err && (
            <form onSubmit={submit} className="authForm">
              <div className="authField">
                <label>New password</label>
                <input
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  minLength={8}
                  required
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />
              </div>

              <div className="authField">
                <label>Confirm password</label>
                <input
                  type="password"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  minLength={8}
                  required
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>

              <button className="authPrimaryBtn" disabled={loading} type="submit">
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          )}

          <div className="authBottom">
            <button type="button" className="authLink" onClick={() => nav("/careers/auth")}>
              Back to sign in
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
