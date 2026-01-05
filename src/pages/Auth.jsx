// src/pages/Auth.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

export default function Auth() {
  const nav = useNavigate();
  const loc = useLocation();

  // ✅ SAFER nextPath:
  // - decode once
  // - allow only internal "/" paths
  // - prevent redirecting back to auth/forgot/reset to avoid infinite "next=next=next..."
  // - cap length to avoid nested URLs exploding
  const nextPath = useMemo(() => {
    const raw = new URLSearchParams(loc.search).get("next");
    const fallback = "/careers";

    if (!raw) return fallback;

    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      decoded = raw;
    }

    if (!decoded.startsWith("/") || decoded.startsWith("//")) return fallback;

    // 🚫 Prevent redirect loops to auth pages
    if (
      decoded.startsWith("/careers/auth") ||
      decoded.startsWith("/forgot-password") ||
      decoded.startsWith("/reset-password")
    ) {
      return fallback;
    }

    // 🚫 Prevent huge nested next values
    if (decoded.length > 300) return fallback;

    return decoded;
  }, [loc.search]);

  const [mode, setMode] = useState("signin"); // signin | signup
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [err, setErr] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const [sessionUser, setSessionUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const cleanEmail = (v) => (v || "").trim().toLowerCase();

  const clearMsgs = () => {
    setErr("");
    setInfoMsg("");
  };

  const continueNow = () => {
    sessionStorage.setItem("careers_auth_ok", "1");
    nav(nextPath, { replace: true });
  };

  // ✅ Inactivity banner (optional)
  useEffect(() => {
    const reason = sessionStorage.getItem("auth_reason");
    if (reason === "inactivity") {
      setInfoMsg("You were signed out due to inactivity. Please sign in again.");
      sessionStorage.removeItem("auth_reason");
    }
  }, []);

  // ✅ Session check on load + auth listener
  useEffect(() => {
    let mounted = true;

    (async () => {
      setCheckingSession(true);
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSessionUser(data?.session?.user || null);
      setCheckingSession(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSessionUser(session?.user || null);
      setCheckingSession(false);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // ✅ If already signed in (refresh/back), redirect immediately (no intermediate page)
  useEffect(() => {
    if (!checkingSession && sessionUser) {
      continueNow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkingSession, sessionUser]);

  /**
   * ✅ OAuth guard:
   * - If user clicked Google in "signin" mode and account was newly created, delete it & show error.
   * - Otherwise, redirect immediately.
   */
  useEffect(() => {
    const run = async () => {
      const intent = sessionStorage.getItem("oauth_intent"); // signin | signup
      const startedAt = Number(sessionStorage.getItem("oauth_started_at") || "0");

      if (!intent || !sessionUser) return;

      try {
        const createdAtMs = Date.parse(sessionUser.created_at || "");
        const wasNew = startedAt && createdAtMs && createdAtMs >= startedAt - 2000;

        // ❌ "Sign in with Google" should NOT create a new account
        if (intent === "signin" && wasNew) {
          const { error: delErr } = await supabase.functions.invoke("delete-user", {
            body: { user_id: sessionUser.id },
          });

          await supabase.auth.signOut();
          setSessionUser(null);

          if (delErr) {
            setErr("Account validation failed. Please try again or use email sign-up.");
          } else {
            setErr("Account doesn’t exist with this Google email. Please create an account first.");
            setMode("signup");
          }
          return;
        }

        // ✅ Valid case → redirect
        continueNow();
      } catch {
        try {
          await supabase.auth.signOut();
        } catch {}
        setSessionUser(null);
        setErr("Could not validate this Google sign-in. Please try again.");
      } finally {
        sessionStorage.removeItem("oauth_intent");
        sessionStorage.removeItem("oauth_started_at");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUser]);

  // ✅ Email/password submit
  const submit = async (e) => {
    e.preventDefault();
    clearMsgs();
    setLoading(true);

    try {
      const em = cleanEmail(email);

      if (mode === "signup") {
        // ✅ Signup should fail if user exists
        const { data: existsData, error: existsErr } = await supabase.functions.invoke(
          "check-user-exists",
          { body: { email: em } }
        );
        if (existsErr) throw existsErr;

        if (existsData?.exists) {
          setErr("Account already exists with this email. Please sign in.");
          setMode("signin");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: em,
          password,
          options: { data: { full_name: name.trim() } },
        });

        if (error) throw error;

        // If confirm email is ON
        if (!data?.session) {
          setInfoMsg("Account created. Please check your email to confirm, then sign in.");
          return;
        }

        continueNow();
      } else {
        // ✅ Signin should only work for existing accounts (explicit check)
        const { data: existsData, error: existsErr } = await supabase.functions.invoke(
          "check-user-exists",
          { body: { email: em } }
        );
        if (existsErr) throw existsErr;

        if (!existsData?.exists) {
          setErr("No account found with this email. Please create an account.");
          setMode("signup");
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: em,
          password,
        });

        if (error) {
          setErr("Incorrect password. Please try again.");
          return;
        }

        if (!data?.session) throw new Error("No session returned");
        continueNow();
      }
    } catch (e2) {
      setErr(e2?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ OAuth start (Google only)
  const oauth = async () => {
    clearMsgs();
    setLoading(true);

    try {
      sessionStorage.setItem("oauth_intent", mode);
      sessionStorage.setItem("oauth_started_at", String(Date.now()));

      // ✅ IMPORTANT: do NOT forward nested ?next=... when already on auth
      // We'll keep redirectTo clean to avoid compounding query strings.
      const redirectTo = `${window.location.origin}/careers/auth`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) throw error;
    } catch (e) {
      setErr(e?.message || "Failed to continue with Google");
      setLoading(false);
      sessionStorage.removeItem("oauth_intent");
      sessionStorage.removeItem("oauth_started_at");
    }
  };

  if (checkingSession) {
    return (
      <div className="page">
        <section className="container" style={{ padding: "56px 0", maxWidth: 520 }}>
          <div className="authCard">
            <div className="jobMuted">Checking session…</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="container" style={{ padding: "56px 0", maxWidth: 520 }}>
        <div className="authCard">
          <div className="authTop">
            <h1 className="authTitle">{mode === "signup" ? "Create account" : "Sign in"}</h1>
            <p className="authSub">
              {mode === "signup"
                ? "Create an account to apply faster and track your applications."
                : "Sign in to continue your application."}
            </p>

            <div className="authTabs">
              <button
                type="button"
                className={`authTab ${mode === "signin" ? "isActive" : ""}`}
                onClick={() => {
                  clearMsgs();
                  setMode("signin");
                }}
              >
                Sign in
              </button>
              <button
                type="button"
                className={`authTab ${mode === "signup" ? "isActive" : ""}`}
                onClick={() => {
                  clearMsgs();
                  setMode("signup");
                }}
              >
                Create account
              </button>
            </div>
          </div>

          {infoMsg && <div className="authSuccess">{infoMsg}</div>}
          {err && <div className="authError">{err}</div>}

          <div className="authSocial">
            <button
              type="button"
              className="authSocialBtn"
              onClick={oauth}
              disabled={loading}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading
                ? "Redirecting…"
                : mode === "signup"
                ? "Create with Google"
                : "Continue with Google"}
            </button>

            <div className="authDivider">
              <span>or</span>
            </div>
          </div>

          <form onSubmit={submit} className="authForm">
            {mode === "signup" && (
              <div className="authField">
                <label>Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="authField">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="authField">
              <label>Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
              />
            </div>

            <button className="authPrimaryBtn" disabled={loading} type="submit">
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>

            <div
              className="authBottom"
              style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}
            >
              {mode === "signin" ? (
                <>
                  <button
                    type="button"
                    className="authLink"
                    onClick={() => nav(`/forgot-password?next=${encodeURIComponent(nextPath)}`)}
                  >
                    Forgot password?
                  </button>

                  <div className="authHint">
                    New user?{" "}
                    <button
                      type="button"
                      className="authLink"
                      onClick={() => {
                        clearMsgs();
                        setMode("signup");
                      }}
                    >
                      Create account
                    </button>
                  </div>
                </>
              ) : (
                <div className="authHint" style={{ marginLeft: "auto" }}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="authLink"
                    onClick={() => {
                      clearMsgs();
                      setMode("signin");
                    }}
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
