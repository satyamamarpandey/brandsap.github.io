// src/components/Pricing.jsx
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pricingRegionV3";

const REGIONS = {
  INDIA: "INDIA",
  GLOBAL: "GLOBAL",
};

const PRICING = {
  INDIA: {
    label: "India",
    monthly: {
      name: "Brandsap Care+",
      price: "₹2,499 setup + ₹999/mo",
      tagline:
        "Full support for brands that want consistent growth. Weekly content, boosts, campaigns, and priority help.",
      trust: [
        "24x7 support",
        "Weekly execution",
        "Tracking + monthly reporting",
        "Priority support",
      ],
      // ✅ Break down Monthly plan into what client gets from Starter + Growth + Scale
      includes: {
        starter: [
          "Fully functional informative website",
          "Digital E-card with QR + share links",
          "Mobile responsive layout",
          "Contact / inquiry setup",
          "Basic launch guidance",
        ],
        growth: [
          "Social media setup (Instagram/Facebook basics)",
          "Profile optimization (bio, highlights, links)",
          "Ads setup (account + pixel + tracking events)",
          "Basic campaign structure for one offer",
          "Minor updates and tweaks after launch",
          "Basic analytics setup to measure leads",
          "Simple guidance for posting consistency",
        ],
        scale: [
          "Database support for products and content",
          "Android and iOS app support",
          "2 campaign supports (launch or seasonal)",
          "SEO optimization improvements",
          "Performance and conversion improvements",
          "Retargeting readiness (pixel, audiences)",
          "More enhancements based on scope",
          "Stronger structure for scaling offers/products",
        ],
      },
      // ✅ Monthly-only extras
      monthlyExtras: [
        "Full social media setup and cleanup (profiles, bios, links)",
        "3 posts per week (designed + scheduled)",
        "5 stories per week with boost",
        "Campaign planning + support (offers, festivals, launches)",
        "Ads support + optimization guidance",
        "SEO improvements + ongoing enhancements",
        "Website updates + landing pages as needed",
        "Faster response + continuous improvements",
      ],
      outcome:
        "Outcome: A complete, managed presence with weekly work, ongoing support, and consistent growth execution.",
      highlight: true,
    },

    project: [
      {
        name: "Starter",
        price: "₹4,499",
        tagline:
          "For businesses that need a clean, shareable presence that looks professional and works on mobile.",
        items: [
          "Fully functional informative website",
          "Digital E-card with QR + share links",
          "Mobile responsive layout",
          "Contact / inquiry setup",
          "Basic launch guidance",
        ],
        outcome:
          "Outcome: A working website + e-card that customers can trust and share.",
      },
      {
        name: "Growth",
        price: "₹11,999",
        tagline:
          "For brands that want visibility, a stronger profile, and a better lead flow.",
        items: [
          "Everything in Starter",
          "Social media setup (Instagram/Facebook basics)",
          "Profile optimization (bio, highlights, links)",
          "Ads setup (account + pixel + tracking events)",
          "Basic campaign structure for one offer",
          "Minor updates and tweaks after launch",
          "Basic analytics setup to measure leads",
          "Simple guidance for posting consistency",
        ],
        outcome:
          "Outcome: Your presence is ready for leads with profiles + tracking + ad setup.",
        highlight: true,
      },
      {
        name: "Scale",
        price: "₹19,999",
        tagline:
          "For brands that want product support, campaigns, SEO, and higher growth potential.",
        items: [
          "Everything in Growth",
          "Database support for products and content",
          "Android and iOS app support",
          "2 campaign supports (launch or seasonal)",
          "SEO optimization improvements",
          "Performance and conversion improvements",
          "Retargeting readiness (pixel, audiences)",
          "More enhancements based on scope",
          "Stronger structure for scaling offers/products",
        ],
        outcome:
          "Outcome: A scalable setup with products, SEO, campaigns, and stronger conversion potential.",
      },
    ],
  },

  GLOBAL: {
    label: "Global",
    monthly: {
      name: "Brandsap Care+",
      price: "$29 setup + $9.99/mo",
      tagline:
        "Full support for brands that want consistent growth. Weekly content, boosts, campaigns, and priority help.",
      trust: [
        "24x7 support",
        "Weekly execution",
        "Tracking + monthly reporting",
        "Priority support",
      ],
      includes: {
        starter: [
          "Fully functional informative website",
          "Digital E-card with QR + share links",
          "Mobile responsive layout",
          "Contact / inquiry setup",
          "Basic launch guidance",
        ],
        growth: [
          "Social media setup (Instagram/Facebook basics)",
          "Profile optimization (bio, highlights, links)",
          "Ads setup (account + pixel + tracking events)",
          "Basic campaign structure for one offer",
          "Minor updates and tweaks after launch",
          "Basic analytics setup to measure leads",
          "Simple guidance for posting consistency",
        ],
        scale: [
          "Database support for products and content",
          "Android and iOS app support",
          "2 campaign supports (launch or seasonal)",
          "SEO optimization improvements",
          "Performance and conversion improvements",
          "Retargeting readiness (pixel, audiences)",
          "More enhancements based on scope",
          "Stronger structure for scaling offers/products",
        ],
      },
      monthlyExtras: [
        "Full social media setup and cleanup (profiles, bios, links)",
        "3 posts per week (designed + scheduled)",
        "5 stories per week with boost",
        "Campaign planning + support (offers, holidays, launches)",
        "Ads support + optimization guidance",
        "SEO improvements + ongoing enhancements",
        "Website updates + landing pages as needed",
        "Faster response + continuous improvements",
      ],
      outcome:
        "Outcome: A complete, managed presence with weekly work, ongoing support, and consistent growth execution.",
      highlight: true,
    },

    project: [
      {
        name: "Starter",
        price: "$49",
        tagline:
          "For businesses that need a clean, shareable presence that looks professional and works on mobile.",
        items: [
          "Fully functional informative website",
          "Digital E-card with QR + share links",
          "Mobile responsive layout",
          "Contact / inquiry setup",
          "Basic launch guidance",
        ],
        outcome:
          "Outcome: A working website + e-card that customers can trust and share.",
      },
      {
        name: "Growth",
        price: "$129",
        tagline:
          "For brands that want visibility, a stronger profile, and a better lead flow.",
        items: [
          "Everything in Starter",
          "Social media setup (Instagram/Facebook basics)",
          "Profile optimization (bio, highlights, links)",
          "Ads setup (account + pixel + tracking events)",
          "Basic campaign structure for one offer",
          "Minor updates and tweaks after launch",
          "Basic analytics setup to measure leads",
          "Simple guidance for posting consistency",
        ],
        outcome:
          "Outcome: Your presence is ready for leads with profiles + tracking + ad setup.",
        highlight: true,
      },
      {
        name: "Scale",
        price: "$239",
        tagline:
          "For brands that want product support, campaigns, SEO, and higher growth potential.",
        items: [
          "Everything in Growth",
          "Database support for products and content",
          "Android and iOS app support",
          "2 campaign supports (launch or seasonal)",
          "SEO optimization improvements",
          "Performance and conversion improvements",
          "Retargeting readiness (pixel, audiences)",
          "More enhancements based on scope",
          "Stronger structure for scaling offers/products",
        ],
        outcome:
          "Outcome: A scalable setup with products, SEO, campaigns, and stronger conversion potential.",
      },
    ],
  },
};

async function getCountryCode() {
  try {
    const r = await fetch("https://ipapi.co/json/");
    if (r.ok) {
      const j = await r.json();
      if (j?.country_code) return String(j.country_code).toUpperCase();
    }
  } catch { }

  try {
    const r = await fetch("https://get.geojs.io/v1/ip/country.json");
    if (r.ok) {
      const j = await r.json();
      if (j?.country_code) return String(j.country_code).toUpperCase();
    }
  } catch { }

  return "";
}

function TrustRow({ items }) {
  if (!items?.length) return null;
  return (
    <div className="pricing-trust-row">
      {items.map((t) => (
        <span key={t} className="chip chip-neutral pricing-trust-chip">
          {t}
        </span>
      ))}
    </div>
  );
}

export default function Pricing() {
  const [region, setRegion] = useState(null); // INDIA | GLOBAL | null
  const [detectState, setDetectState] = useState("detecting"); // detecting | detected | failed

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = (params.get("region") || "").toUpperCase();

    if (q === "IN" || q === "INDIA") {
      setRegion(REGIONS.INDIA);
      setDetectState("detected");
      localStorage.setItem(STORAGE_KEY, REGIONS.INDIA);
      return;
    }
    if (q === "GLOBAL") {
      setRegion(REGIONS.GLOBAL);
      setDetectState("detected");
      localStorage.setItem(STORAGE_KEY, REGIONS.GLOBAL);
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === REGIONS.INDIA || saved === REGIONS.GLOBAL) {
      setRegion(saved);
      setDetectState("detected");
      return;
    }

    (async () => {
      setDetectState("detecting");
      const cc = await getCountryCode();

      if (!cc) {
        setDetectState("failed");
        setRegion(null);
        return;
      }

      const inferred = cc === "IN" ? REGIONS.INDIA : REGIONS.GLOBAL;
      setRegion(inferred);
      localStorage.setItem(STORAGE_KEY, inferred);
      setDetectState("detected");
    })();
  }, []);

  const activeRegion = region || REGIONS.GLOBAL;
  const data = useMemo(() => PRICING[activeRegion], [activeRegion]);
  const showChooser = detectState === "failed";

  const pickRegion = (next) => {
    setRegion(next);
    localStorage.setItem(STORAGE_KEY, next);
    setDetectState("detected");
  };

  const flipRegion = () => {
    const next = activeRegion === REGIONS.INDIA ? REGIONS.GLOBAL : REGIONS.INDIA;
    pickRegion(next);
  };

  const contactUrlForPlan = (planName) => {
    const params = new URLSearchParams();
    params.set("plan", planName);
    params.set("region", activeRegion);
    return `/contact?${params.toString()}`;
  };

  const monthly = data.monthly;
  const projectPlans = data.project;

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">Pricing</div>

          {showChooser ? (
            <div className="hero-card hero-card-main glass-card pricing-region-chooser">
              <p style={{ margin: 0, opacity: 0.9 }}>
                We could not detect your location. Please choose your pricing region:
              </p>
              <div className="pricing-region-actions">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => pickRegion(REGIONS.INDIA)}
                >
                  India pricing
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => pickRegion(REGIONS.GLOBAL)}
                >
                  Global pricing
                </button>
              </div>
            </div>
          ) : (
            <div className="pricing-region-line">
              <span>Showing {data.label} pricing</span>
              <span className="meta-dot" />
              <button type="button" className="ghost-btn" onClick={flipRegion}>
                Change region
              </button>
            </div>
          )}
        </div>

        {/* MONTHLY (FULL WIDTH + 3-COLUMN INCLUDES GRID) */}
        <div className="section-heading section-heading-center" style={{ marginTop: "2rem" }}>
          <h2>Monthly Partnership</h2>
          <p className="pricing-subcopy">{monthly.tagline}</p>
          <TrustRow items={monthly.trust} />
        </div>

        <div className="feature-grid wipe-group">
          <article
            className={
              "feature-card glass-card wipe-ltr pricing-monthly-card" +
              (monthly.highlight ? " feature-card-highlight" : "")
            }
          >
            <div className="pricing-card-head">
              <span className="chip chip-neutral">{monthly.name}</span>
              <span className="chip chip-neutral">Full support</span>
            </div>

            <h3 className="pricing-price">{monthly.price}</h3>

            {/* ✅ 3-column grid on laptop, 1 column on mobile */}
            <div className="pricing-includes-grid">
              <div className="pricing-includes-col">
                <div className="pricing-col-title">Starter included</div>
                <ul className="pricing-list">
                  {monthly.includes.starter.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              <div className="pricing-includes-col">
                <div className="pricing-col-title">Growth included</div>
                <ul className="pricing-list">
                  {monthly.includes.growth.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              <div className="pricing-includes-col">
                <div className="pricing-col-title">Scale included</div>
                <ul className="pricing-list">
                  {monthly.includes.scale.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pricing-monthly-extras">
              <div className="pricing-col-title">Monthly support extras</div>
              <ul className="pricing-list">
                {monthly.monthlyExtras.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <div className="pricing-outcome">
              <strong>{monthly.outcome}</strong>
            </div>

            <div className="pricing-actions">
              <a className="primary-btn" href={contactUrlForPlan(monthly.name)}>
                Start {monthly.name}
              </a>
              <a className="ghost-btn" href={contactUrlForPlan(monthly.name)}>
                Talk to us first
              </a>
            </div>
          </article>
        </div>

        {/* PROJECT PRICING BELOW */}
        <div className="section-heading section-heading-center" style={{ marginTop: "3rem" }}>
          <div className="pill pill-soft">One time</div>
          <h2>Project pricing</h2>
          <p>
            Best if you want a one time setup. You can upgrade to Monthly Partnership anytime.
          </p>
        </div>

        <div className="feature-grid wipe-group">
          {projectPlans.map((plan) => (
            <article
              key={`${plan.name}-${plan.price}`}
              className={
                "feature-card glass-card wipe-ltr" +
                (plan.highlight ? " feature-card-highlight" : "")
              }
            >
              <span className="chip chip-neutral">{plan.name}</span>
              <h3 className="pricing-price">{plan.price}</h3>
              <p className="pricing-tagline">{plan.tagline}</p>

              <ul className="pricing-list">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="pricing-outcome">
                <strong>{plan.outcome}</strong>
              </div>

              <div className="pricing-actions">
                <a className="primary-btn" href={contactUrlForPlan(plan.name)}>
                  Choose {plan.name}
                </a>
                <a className="ghost-btn" href={contactUrlForPlan(plan.name)}>
                  Ask a question
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="section-heading section-heading-center" style={{ marginTop: "2.2rem" }}>
        </div>
      </div>
    </section>
  );
}
