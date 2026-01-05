import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
});

function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;

  // ✅ Add/keep your origins here
  const allow = [
    "https://brandsap.github.io",
    "http://localhost:5173",
    "http://localhost:3000",
  ];

  return allow.includes(origin);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const allowOrigin = isAllowedOrigin(origin) ? origin! : "";

  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(allowOrigin) });
  }

  // ✅ Only POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders(allowOrigin), "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("PROJECT_URL");
    const serviceKey = Deno.env.get("SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: "Missing server secrets" }), {
        status: 500,
        headers: { ...corsHeaders(allowOrigin), "Content-Type": "application/json" },
      });
    }

    // ✅ Must be signed in (JWT in Authorization header)
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing access token" }), {
        status: 401,
        headers: { ...corsHeaders(allowOrigin), "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    // ✅ Get the caller (from token)
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders(allowOrigin), "Content-Type": "application/json" },
      });
    }

    const callerId = userData.user.id;

    // ✅ Read body
    const body = await req.json().catch(() => ({}));
    const user_id = body?.user_id;

    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400,
        headers: { ...corsHeaders(allowOrigin), "Content-Type": "application/json" },
      });
    }

    // ✅ Only allow self-delete
    if (user_id !== callerId) {
      return new Response(JSON.stringify({ error: "Not allowed" }), {
        status: 403,
        headers: { ...corsHeaders(allowOrigin), "Content-Type": "application/json" },
      });
    }

    // ✅ Delete
    const { error: delErr } = await admin.auth.admin.deleteUser(user_id);
    if (delErr) {
      return new Response(JSON.stringify({ error: delErr.message }), {
        status: 500,
        headers: { ...corsHeaders(allowOrigin), "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders(allowOrigin), "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders(allowOrigin), "Content-Type": "application/json" },
    });
  }
});
