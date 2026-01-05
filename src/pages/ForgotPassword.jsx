import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

export default function ForgotPassword() {
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const nextPath = useMemo(() => {
    const p = new URLSearchParams(loc.search).get("next");
    return p && p.startsWith("/") ? p : "/careers";
  }, [loc.search]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password?next=${encodeURIComponent(nextPath)}`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) throw error;

      setMsg("If this email exists, a reset link has been sent. Please check your inbox.");
    } catch (e2) {
      setErr(e2?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="container" style={{ padding: "56px 0", maxWidth: 520 }}>
        <div className="authCard">
          <h1 className="authTitle">Forgot password</h1>
          <p className="authSub">Enter your email and we’ll send a reset link.</p>

          {err && <div className="authError">{err}</div>}
          {msg && <div className="authSuccess">{msg}</div>}

          <form onSubmit={submit} className="authForm">
            <div className="authField">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <button className="authPrimaryBtn" disabled={loading} type="submit">
              {loading ? "Sending…" : "Send reset link"}
            </button>

            <div className="authBottom">
              <button type="button" className="authLink" onClick={() => nav(`/careers/auth?next=${encodeURIComponent(nextPath)}`)}>
                Back to sign in
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
