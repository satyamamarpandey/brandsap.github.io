import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

const DEFAULT_MINUTES = 20; // change this (e.g., 15/20/30)

export default function InactivityLogout({ minutes = DEFAULT_MINUTES }) {
  const nav = useNavigate();
  const loc = useLocation();
  const timerRef = useRef(null);

  const ms = minutes * 60 * 1000;

  const clearTimer = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const startTimer = () => {
    clearTimer();
    timerRef.current = window.setTimeout(async () => {
      // sign out due to inactivity
      await supabase.auth.signOut();

      // clear your gate (so apply pages force auth again)
      sessionStorage.removeItem("careers_auth_ok");

      // remember why we redirected (so Auth page can show message)
      sessionStorage.setItem("auth_reason", "inactivity");

      // keep the same destination after sign-in
      const next = loc.pathname + (loc.search || "");
      nav(`/careers/auth?next=${encodeURIComponent(next)}`, { replace: true });
    }, ms);
  };

  useEffect(() => {
    const reset = () => startTimer();

    // user activity events
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    startTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname, loc.search, ms]);

  return null;
}
