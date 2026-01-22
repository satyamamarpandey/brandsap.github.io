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

  // ✅ Only enforce inactivity logout on careers pages
  const here = loc.pathname + (loc.search || "");
  if (!here.startsWith("/careers")) return;

  timerRef.current = window.setTimeout(async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("careers_auth_ok");
    sessionStorage.setItem("auth_reason", "inactivity");

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
