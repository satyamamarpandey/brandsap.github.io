// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/SupabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);

  const nameFromUser = (u) => {
    const meta = u?.user_metadata || {};
    return (
      meta.full_name ||
      meta.name || // Google OAuth often provides `name`
      u?.email?.split("@")?.[0] ||
      ""
    );
  };

  async function loadDisplayName(u) {
    if (!u) {
      setDisplayName("");
      return;
    }

    // 1) fast: auth metadata
    const n1 = nameFromUser(u);
    if (n1) {
      setDisplayName(n1);
      return;
    }

    // 2) fallback: latest application full_name (your applications table already has it)
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("full_name")
        .eq("user_id", u.id)
        .not("full_name", "is", null)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && data?.[0]?.full_name) {
        setDisplayName(data[0].full_name);
      } else {
        setDisplayName(u?.email?.split("@")?.[0] || "Account");
      }
    } catch {
      setDisplayName(u?.email?.split("@")?.[0] || "Account");
    }
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        const u = data?.session?.user ?? null;
        setUser(u);
        await loadDisplayName(u);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      await loadDisplayName(u);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, displayName, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

