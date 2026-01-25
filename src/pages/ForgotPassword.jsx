import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

// Local QA: localhost in dev; production domain in prod
const RESET_BASE_URL =
  import.meta.env.MODE === "development"
    ? window.location.origin
    : "https://brandsap.com";

export default function ForgotPassword() {
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const nextPath = useMemo(() => {
    const p = new URLSearchParams(loc.search).get("next");
    return p && p.startsWith("/") ? p : "/careers";
  }, [loc.search]);

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const now = Date.now();
    if (now < cooldownUntil) {
      const seconds = Math.ceil((cooldownUntil - now) / 1000);
      setErr("");
      setMsg(`Please wait ${seconds}s before requesting another reset email.`);
      return;
    }

    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const redirectTo = `${RESET_BASE_URL}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });
      if (error) throw error;

      setCooldownUntil(Date.now() + 60_000);

      setMsg(
        "If this email exists, a reset link has been sent. Please check your inbox."
      );
    } catch (e2) {
      const m = (e2?.message || "").toLowerCase();
      if (m.includes("rate limit")) {
        setErr("Email rate limit reached. Please wait and try again later.");
      } else {
        setErr(e2?.message || "Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section
        className="container"
        style={{ padding: "56px 16px", maxWidth: 520, margin: "0 auto" }}
      >
        <div className="authCard">
          <h1 className="authTitle">Forgot password</h1>
          <p className="authSub">Enter your email and we’ll send a reset link.</p>

          {err && <div className="authError">{err}</div>}
          {msg && <div className="authSuccess">{msg}</div>}

          <form onSubmit={submit} className="authForm">
            <div className="authField">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <button className="authPrimaryBtn" disabled={loading} type="submit">
              {loading ? "Sending…" : "Send reset link"}
            </button>

            <div className="authBottom">
              <button
                type="button"
                className="authLink"
                onClick={() => nav(`/careers/auth?next=${encodeURIComponent(nextPath)}`)}
              >
                Back to sign in
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
