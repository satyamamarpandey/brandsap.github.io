// src/pages/Contact.jsx (or src/pages/Contact.jsx)
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const PHONE_CODES = [
  { code: "+1", label: "US / Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+91", label: "India (+91)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "", label: "Other" },
];

const PLAN_OPTIONS = ["Brandsap Care+", "Starter", "Growth", "Scale", "Not sure yet"];

export default function Contact() {
  const location = useLocation();

  const initial = useMemo(
    () => ({
      plan: "", // ✅ added (preselected from pricing)
      region: "", // ✅ optional context (India/Global)
      name: "",
      email: "",
      phoneCode: "+1",
      phone: "",
      company: "",
      website: "",
      service: "",
      timeline: "",
      budget: "",
      message: "",
    }),
    []
  );

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  // ✅ read ?plan=...&region=... from Pricing page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get("plan") || "";
    const region = params.get("region") || "";

    if (plan || region) {
      setForm((p) => ({
        ...p,
        plan: plan || p.plan,
        region: region || p.region,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const touch = (k) => setTouched((p) => ({ ...p, [k]: true }));

  const errors = (() => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email.";

    if (!form.phone.trim()) e.phone = "Phone number is required.";
    const digits = (form.phone || "").replace(/\D/g, "");
    if (form.phone.trim() && (digits.length < 7 || digits.length > 15)) {
      e.phone = "Enter a valid phone number.";
    }

    if (!form.company.trim()) e.company = "Company / product is required.";

    // ✅ If plan is selected, service can be optional.
    // If plan is empty, service remains required.
    if (!form.plan.trim() && !form.service) e.service = "Please select what you need.";

    if (!form.timeline) e.timeline = "Please select a timeline.";
    if (!form.message.trim()) e.message = "Please share a short message.";
    return e;
  })();

  const hasErrors = Object.keys(errors).length > 0;

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    setTouched({
      plan: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      service: true,
      timeline: true,
      message: true,
    });

    if (hasErrors) {
      setStatus({
        type: "error",
        message: "Please fill in the required fields marked with *.",
      });
      return;
    }

    try {
      setSubmitting(true);

      // ✅ Example payload would include:
      // plan: form.plan
      // region: form.region
      // phone: `${form.phoneCode} ${form.phone}`
      // TODO: Replace with your real submit (Supabase / Formspree / email API)

      await new Promise((r) => setTimeout(r, 450));

      setStatus({
        type: "success",
        message:
          "Thanks! We received your message. We’ll reply shortly with next steps and availability.",
      });
      setForm(initial);
      setTouched({});
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const Req = () => <span className="req-star" aria-hidden="true">*</span>;

  const FieldError = ({ k }) =>
    touched[k] && errors[k] ? (
      <div className="field-error" role="alert">
        {errors[k]}
      </div>
    ) : null;

  const showSelectedBanner = Boolean(form.plan || form.region);

  const planOptions = (() => {
    // ensure we show any plan passed via URL even if not in the list
    const base = [...PLAN_OPTIONS];
    if (form.plan && !base.includes(form.plan)) base.unshift(form.plan);
    return base;
  })();

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">Contact</div>
          <h2>Tell us what you want to build.</h2>
          <p>
            Share a few quick details. We’ll respond with next steps and availability.
          </p>
        </div>

        <div className="hero-card hero-card-main glass-card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            {showSelectedBanner ? (
              <div className="form-status is-success" role="status" style={{ marginBottom: "0.9rem" }}>
                <strong>Selected:</strong>{" "}
                {form.plan ? form.plan : "Plan not selected"}
                {form.region ? ` • ${form.region === "INDIA" ? "India pricing" : "Global pricing"}` : ""}
              </div>
            ) : null}

            {status.message ? (
              <div
                className={`form-status ${status.type === "success" ? "is-success" : "is-error"}`}
                role="status"
              >
                {status.message}
              </div>
            ) : null}

            {/* ✅ NEW: Plan */}
            <div className="input-group">
              <label>Selected plan (optional)</label>
              <select
                value={form.plan}
                onChange={(e) => setField("plan", e.target.value)}
                onBlur={() => touch("plan")}
              >
                <option value="">Select</option>
                {planOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <FieldError k="plan" />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>
                  Name <Req />
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={() => touch("name")}
                  required
                  aria-required="true"
                  placeholder="Your name"
                />
                <FieldError k="name" />
              </div>

              <div className="input-group">
                <label>
                  Email <Req />
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={() => touch("email")}
                  required
                  aria-required="true"
                  placeholder="you@company.com"
                />
                <FieldError k="email" />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group" style={{ maxWidth: 200 }}>
                <label>
                  Code <Req />
                </label>
                <select
                  value={form.phoneCode}
                  onChange={(e) => setField("phoneCode", e.target.value)}
                  aria-label="Phone country code"
                >
                  {PHONE_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ flex: 1 }}>
                <label>
                  Phone <Req />
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  onBlur={() => touch("phone")}
                  required
                  aria-required="true"
                  placeholder="Phone number"
                  inputMode="tel"
                  autoComplete="tel"
                />
                <FieldError k="phone" />
              </div>
            </div>

            <div className="input-group">
              <label>
                Company / product <Req />
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setField("company", e.target.value)}
                onBlur={() => touch("company")}
                required
                aria-required="true"
                placeholder="Brand or product name"
              />
              <FieldError k="company" />
            </div>

            <div className="input-group">
              <label>Website (optional)</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
                placeholder="https://"
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>
                  What do you need? {!form.plan ? <Req /> : null}
                </label>
                <select
                  value={form.service}
                  onChange={(e) => setField("service", e.target.value)}
                  onBlur={() => touch("service")}
                  required={!form.plan}
                  aria-required={!form.plan ? "true" : "false"}
                >
                  <option value="">Select</option>
                  <option>Website + E-card</option>
                  <option>Social media setup</option>
                  <option>Ads setup</option>
                  <option>SEO optimization</option>
                  <option>Campaign support</option>
                  <option>Not sure yet</option>
                </select>
                <FieldError k="service" />
              </div>

              <div className="input-group">
                <label>
                  Timeline <Req />
                </label>
                <select
                  value={form.timeline}
                  onChange={(e) => setField("timeline", e.target.value)}
                  onBlur={() => touch("timeline")}
                  required
                  aria-required="true"
                >
                  <option value="">Select</option>
                  <option>ASAP (1-2 days)</option>
                  <option>1 week</option>
                  <option>1-3 weeks</option>
                  <option>Flexible</option>
                  <option>Not sure yet</option>
                </select>
                <FieldError k="timeline" />
              </div>
            </div>

            <div className="input-group">
              <label>Budget (optional)</label>
              <select value={form.budget} onChange={(e) => setField("budget", e.target.value)}>
                <option value="">Select</option>
                <option>1k-5k</option>
                <option>5k-10k</option>
                <option>10k-20k</option>
                <option>20k+</option>
                <option>Not sure yet</option>
              </select>
            </div>

            <div className="input-group">
              <label>
                Message <Req />
              </label>
              <textarea
                rows="4"
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                onBlur={() => touch("message")}
                required
                aria-required="true"
                placeholder="A short note about your business and what success looks like."
              />
              <FieldError k="message" />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={submitting}
              style={{ width: "100%", marginTop: "0.6rem" }}
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
