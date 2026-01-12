// src/components/FeatureSection.jsx
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FEATURES = [
  {
    id: "strategy",
    tag: "Strategy",
    title: "Brand foundations",
    body:
      "Clear positioning, messaging, and offers so customers understand you fast and trust you sooner.",
    items: [
      "Positioning & narrative",
      "Offer clarity (what you do + for who)",
      "Messaging pillars + tagline options",
      "Competitor and market scan",
      "Service menu / package structure",
      "Launch roadmap (what to do first)",
    ],
    deliverables: [
      "Brand clarity brief (1-page)",
      "Messaging guide (headlines, CTAs, tone)",
      "Offer / service structure",
      "Website sitemap and page plan",
      "Launch plan with priorities",
    ],
    outcomes: [
      "Customers understand your value faster",
      "More confidence in sales calls and content",
      "A clear plan for website + campaigns",
    ],
  },

  {
    id: "design",
    tag: "Design",
    title: "Visual identity",
    body:
      "A premium visual system that looks consistent across website, social, ads, and print.",
    items: [
      "Logo suite (primary + alternate)",
      "Color palette + typography",
      "Brand patterns + icons",
      "Design tokens for web",
      "Canva templates (posts, stories, flyers)",
      "E-card design (QR + share links)",
    ],
    deliverables: [
      "Brand kit (colors, fonts, usage)",
      "Logo exports + social avatars",
      "Template pack (Canva-ready)",
      "E-card visuals + QR layout",
      "Basic usage guidelines",
    ],
    outcomes: [
      "Your brand looks credible everywhere",
      "Faster content creation with templates",
      "Consistent look across platforms",
    ],
  },

  {
    id: "digital",
    tag: "Digital",
    title: "Website & growth setup",
    body:
      "Fast, mobile-first website plus local presence setup, lead capture, and tracking to support growth.",
    items: [
      "Website build (landing + key pages)",
      "Google Business Profile optimization",
      "Local SEO basics (keywords + structure)",
      "Lead forms + WhatsApp / call actions",
      "Tracking setup (GA4, pixel, events)",
      "Campaign pages for offers/festivals",
    ],
    deliverables: [
      "Website (responsive + fast)",
      "SEO basics + metadata",
      "Google profile setup checklist",
      "Lead capture + booking links",
      "Tracking and conversion events",
      "Launch checklist + handoff",
    ],
    outcomes: [
      "More leads and inquiries from mobile",
      "Better local visibility and discovery",
      "Clear tracking of what is working",
    ],
  },
];

export default function FeatureSection({ activeId, onClose }) {
  // ESC to close
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, onClose]);

  const open = (id) => {
    if (!id) return;
    // Optional: allow parent to control activeId via click
    // If you already set activeId from outside, ignore this.
  };

  return (
    <div className="container">
      <div className="section-heading section-heading-center">
        <div className="pill pill-soft">What we ship</div>
        <h2>Everything your brand needs to launch and grow.</h2>
        <p>
          Local businesses and mid brands use us to build a credible presence, attract customers,
          and stay consistent with content, campaigns, and improvements.
        </p>
      </div>

      {/* Normal grid */}
      <div className="feature-grid">
        {FEATURES.map((feat) => (
          <article
            key={feat.id}
            className="feature-card glass-card"
            role="button"
            tabIndex={0}
            onClick={() => (window.location.href = "/services")}
            onKeyDown={(e) => {
              if (e.key === "Enter") window.location.href = "/services";
            }}
          >
            <span className="chip chip-neutral">{feat.tag}</span>
            <h3>{feat.title}</h3>
            <p>{feat.body}</p>

            <ul>
              {feat.items.slice(0, 6).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div
              style={{
                marginTop: "0.85rem",
                paddingTop: "0.85rem",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.75rem",
                opacity: 0.95,
              }}
            >
              <span style={{ fontSize: "0.95rem" }}>See details</span>
              <span className="chip chip-neutral" style={{ fontSize: "0.85rem" }}>
                Deliverables + outcomes
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Expanded shared card */}
      <AnimatePresence>
        {activeId && (
          <>
            <motion.div
              className="feature-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.article
              layout
              layoutId={`shared-card-${activeId}`}
              className="feature-expanded glass-card"
              initial={{ borderRadius: 24 }}
              animate={{ borderRadius: 24 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
            >
              {(() => {
                const feat = FEATURES.find((f) => f.id === activeId);
                if (!feat) return null;

                return (
                  <>
                    <div className="feature-expanded-top">
                      <span className="chip chip-neutral">{feat.tag}</span>
                      <button className="icon-btn" onClick={onClose} aria-label="Close">
                        ✕
                      </button>
                    </div>

                    <h3 className="feature-expanded-title">{feat.title}</h3>
                    <p className="feature-expanded-body">{feat.body}</p>

                    <div className="feature-expanded-split">
                      <div className="feature-expanded-col">
                        <h4>What is included</h4>
                        <ul>
                          {feat.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="feature-expanded-col">
                        <h4>Typical deliverables</h4>
                        <ul>
                          {feat.deliverables.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>

                        <h4 style={{ marginTop: "1rem" }}>Expected outcomes</h4>
                        <ul>
                          {feat.outcomes.map((o) => (
                            <li key={o}>{o}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.9rem",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        background: "rgba(255,255,255,0.02)",
                        opacity: 0.95,
                      }}
                    >
                      <strong>How we keep it trustworthy:</strong>
                      <div style={{ marginTop: "0.35rem", opacity: 0.9 }}>
                        We set clear deliverables, implement tracking, and share progress updates so you always know
                        what is done, what is next, and what is improving.
                      </div>
                    </div>

                    <div className="feature-expanded-cta">
                      <button
                        className="primary-btn"
                        onClick={() => (window.location.href = "/contact")}
                      >
                        Start building
                      </button>
                      <button className="ghost-btn" onClick={onClose}>
                        Back to grid
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.article>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
