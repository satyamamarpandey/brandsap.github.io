import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

export default function ResetPassword() {
  const nav = useNavigate();
  const loc = useLocation();

  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const nextPath = useMemo(() => {
    const p = new URLSearchParams(loc.search).get("next");
    return p && p.startsWith("/") ? p : "/careers/auth";
  }, [loc.search]);

  useEffect(() => {
    (async () => {
      setErr("");
      setMsg("");

      // 1) If Supabase already processed the link and cleaned the URL,
      //    we should already have a session here.
      const { data: s1 } = await supabase.auth.getSession();
      if (s1?.session) {
        setReady(true);
        return;
      }

      // 2) If not, try processing URL (covers both PKCE ?code and hash recovery)
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hasRecoveryHash = window.location.hash?.includes("type=recovery");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setErr(error.message || "Reset link is invalid or expired. Please request a new one.");
          setReady(true);
          return;
        }
        const { data: s2 } = await supabase.auth.getSession();
        if (!s2?.session) {
          setErr("Session not created. Please request a new reset link and try again.");
        }
        setReady(true);
        return;
      }

      if (hasRecoveryHash) {
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
        if (error || !data?.session) {
          setErr(error?.message || "Reset link is invalid or expired. Please request a new one.");
          setReady(true);
          return;
        }
        setReady(true);
        return;
      }

      // 3) No session + no URL params
      setErr("Reset link is invalid or expired. Please request a new one.");
      setReady(true);
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
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
