import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { pool } from "./db.js";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import multer from "multer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_ORIGIN].filter(Boolean),
    credentials: true,
  })
);

const PORT = process.env.PORT || 5179;

/* ---------------------------
   Uploads
----------------------------*/
const __dirname = path.resolve();
const UPLOAD_DIR = path.join(__dirname, "server", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use("/uploads", express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const unique = `${Date.now()}_${Math.random().toString(16).slice(2)}_${safe}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!ok.includes(file.mimetype)) return cb(new Error("Only PDF/DOC/DOCX allowed"));
    cb(null, true);
  },
});

/* ---------------------------
   Helpers
----------------------------*/
const JWT_SECRET = process.env.JWT_SECRET || "change_me";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}

function auth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Not signed in" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }
}

/* ---------------------------
   Seed jobs once
----------------------------*/
async function seedJobsIfEmpty() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS c FROM jobs");
  if (rows[0].c > 0) return;

  const jobs = [
    {
      title: "Marketing Analyst",
      department: "Growth",
      level: "Mid",
      type: "Full-time",
      location: "Remote / India",
      description:
        "As a Marketing Analyst at Brandsap, you will turn campaign and customer data into clear insights that drive growth. You’ll track acquisition performance, measure funnel conversion, and support experimentation across channels. You will work closely with growth, content, and product teams to improve ROI, increase qualified leads, and identify what’s working (and what isn’t).",
      responsibilities: [
        "Track CAC, ROAS, conversion rate, and retention across acquisition channels",
        "Build weekly and monthly performance dashboards and reporting",
        "Analyze campaigns (Google/Meta/email) and recommend optimizations",
        "Support A/B test analysis and experimentation reporting",
        "Maintain clean tracking setup (UTMs, events, goal funnels) and data QA",
      ],
      requirements: [
        "2+ years in marketing analytics, growth analytics, or performance analysis",
        "Strong Excel/Sheets and solid SQL fundamentals",
        "Familiarity with Google Analytics, Ads platforms, and attribution basics",
        "Ability to explain insights clearly to non-technical stakeholders",
      ],
    },
    {
      title: "Developer Analyst",
      department: "Engineering",
      level: "Entry / Mid",
      type: "Full-time",
      location: "Remote",
      description:
        "As a Developer Analyst at Brandsap, you’ll support engineering and product teams by analyzing product usage, web performance, and key technical metrics. You’ll help monitor KPIs, identify bottlenecks, and improve user experience through data-driven insights. This role blends analytical thinking with strong technical curiosity—you’ll work with APIs, event data, and dashboards to help the team ship smarter and faster.",
      responsibilities: [
        "Analyze web/app usage metrics and user behavior patterns",
        "Support KPI tracking (performance, reliability, feature adoption)",
        "Work with APIs/logs to extract and validate analytics data",
        "Create dashboards and reporting to support product decisions",
        "Assist with A/B test analysis and experimentation measurement",
      ],
      requirements: [
        "Comfortable with JavaScript basics and strong analytical mindset",
        "Basic understanding of APIs and JSON data",
        "Experience with SQL or willingness to learn quickly",
        "Good communication and ability to document findings clearly",
      ],
    },
  ];

  for (const j of jobs) {
    await pool.query(
      `INSERT INTO jobs (title, department, level, type, location, description, responsibilities, requirements)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        j.title,
        j.department,
        j.level,
        j.type,
        j.location,
        j.description,
        JSON.stringify(j.responsibilities),
        JSON.stringify(j.requirements),
      ]
    );
  }

  console.log("✅ Seeded jobs");
}

/* ---------------------------
   Health
----------------------------*/
app.get("/health", (req, res) => res.json({ ok: true }));

/* ---------------------------
   Auth
----------------------------*/
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  const hash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1,$2,$3)
       RETURNING id, name, email`,
      [name.trim(), email.toLowerCase().trim(), hash]
    );

    const user = result.rows[0];
    const token = signToken(user);
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.json(user);
  } catch (e) {
    if (String(e).includes("users_email_key")) return res.status(409).json({ error: "Email already exists" });
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const r = await pool.query(`SELECT id, name, email, password_hash FROM users WHERE email=$1`, [
    email.toLowerCase().trim(),
  ]);

  const user = r.rows[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user);
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

app.get("/me", auth, async (req, res) => {
  const r = await pool.query(`SELECT id, name, email FROM users WHERE id=$1`, [req.user.id]);
  res.json(r.rows[0]);
});

app.post("/auth/forgot", async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });

  const r = await pool.query(`SELECT id, email FROM users WHERE email=$1`, [email.toLowerCase().trim()]);
  const user = r.rows[0];
  if (!user) return res.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await pool.query(`UPDATE users SET reset_token=$1, reset_token_expires=$2 WHERE id=$3`, [
    token,
    expires,
    user.id,
  ]);

  console.log("RESET LINK:", `http://localhost:5173/reset-password/${token}`);
  res.json({ ok: true });
});

app.post("/auth/reset", async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ error: "Missing fields" });

  const r = await pool.query(`SELECT id FROM users WHERE reset_token=$1 AND reset_token_expires > NOW()`, [token]);
  const user = r.rows[0];
  if (!user) return res.status(400).json({ error: "Reset link expired or invalid" });

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `UPDATE users SET password_hash=$1, reset_token=NULL, reset_token_expires=NULL WHERE id=$2`,
    [hash, user.id]
  );

  res.json({ ok: true });
});

/* ---------------------------
   Jobs
----------------------------*/
app.get("/jobs", async (req, res) => {
  const result = await pool.query(
    `SELECT id, title, department, level, type, location
     FROM jobs WHERE is_active=true
     ORDER BY created_at DESC`
  );
  res.json(result.rows);
});

app.get("/jobs/:id", async (req, res) => {
  const { id } = req.params;

  // ✅ prevent crash when /jobs/auth or bad id is hit
  if (!UUID_RE.test(id)) return res.status(400).json({ error: "Invalid job id" });

  const result = await pool.query(`SELECT * FROM jobs WHERE id=$1 AND is_active=true`, [id]);
  const job = result.rows[0];
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

/* ---------------------------
   Applications (Protected + resume upload)
----------------------------*/
app.post("/applications", auth, upload.single("resume"), async (req, res) => {
  try {
    const { job_id, full_name, email, phone, linkedin, portfolio, cover_letter } = req.body || {};

    if (!job_id || !full_name || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!UUID_RE.test(job_id)) return res.status(400).json({ error: "Invalid job id" });
    if (!req.file) return res.status(400).json({ error: "Resume is required" });

    const jobCheck = await pool.query(`SELECT id FROM jobs WHERE id=$1 AND is_active=true`, [job_id]);
    if (!jobCheck.rows[0]) return res.status(404).json({ error: "Job not found" });

    const resume_url = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO applications
       (user_id, job_id, full_name, email, phone, linkedin, portfolio, cover_letter,
        resume_url, resume_filename, resume_mime, resume_size)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id, status, created_at`,
      [
        req.user.id,
        job_id,
        full_name.trim(),
        email.toLowerCase().trim(),
        phone.trim(),
        linkedin?.trim() || null,
        portfolio?.trim() || null,
        cover_letter?.trim() || null,
        resume_url,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
      ]
    );

    res.json({ ok: true, application: result.rows[0] });
  } catch (e) {
    if (String(e).includes("applications_user_id_job_id_key")) {
      return res.status(409).json({ error: "You already applied for this job." });
    }
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/applications/me", auth, async (req, res) => {
  const result = await pool.query(
    `SELECT a.*, j.title
     FROM applications a
     JOIN jobs j ON j.id=a.job_id
     WHERE a.user_id=$1
     ORDER BY a.created_at DESC`,
    [req.user.id]
  );
  res.json(result.rows);
});

/* ---------------------------
   Global error handler (keeps server alive)
----------------------------*/
app.use((err, req, res, next) => {
  console.error("❌ API error:", err);

  if (err?.message?.includes("Only PDF/DOC/DOCX")) {
    return res.status(400).json({ error: err.message });
  }
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Resume too large (max 5MB)" });
  }

  return res.status(500).json({ error: "Server error" });
});

/* ---------------------------
   Start
----------------------------*/
seedJobsIfEmpty()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("DB error:", e);
    process.exit(1);
  });
