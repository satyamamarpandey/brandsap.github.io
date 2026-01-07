// src/components/FeatureSection.jsx
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FEATURES = [
  {
    id: "strategy",
    tag: "Strategy",
    title: "Brand foundations",
    body: "Workshops, positioning, and messaging systems that keep every touchpoint aligned.",
    items: ["Positioning & narrative", "Voice and tone", "Launch roadmap"],
  },
  {
    id: "design",
    tag: "Design",
    title: "Visual identity",
    body: "Logos, color systems, and component libraries tuned for digital products.",
    items: ["Logo suites", "Design tokens", "UI component kit"],
  },
  {
    id: "digital",
    tag: "Digital",
    title: "Web & product",
    body: "Responsive marketing sites and product-adjacent experiences built in React.",
    items: ["Landing pages", "Product marketing", "Interactive demos"],
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

  return (
    <div className="container">
      <div className="section-heading section-heading-center">
        <div className="pill pill-soft">What we ship</div>
        <h2>Everything your brand needs to launch and grow.</h2>
        <p>
          From first concept to live website, we stay with you through each
          iteration so your brand evolves with your product.
        </p>
      </div>

      {/* Normal grid (always visible) */}
      <div className="feature-grid">
        {FEATURES.map((feat) => (
          <article key={feat.id} className="feature-card glass-card">
            <span className="chip chip-neutral">{feat.tag}</span>
            <h3>{feat.title}</h3>
            <p>{feat.body}</p>
            <ul>
              {feat.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* Expanding shared card (destination) */}
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
                        <h4>Included</h4>
                        <ul>
                          {feat.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="feature-expanded-col">
                        <h4>Typical deliverables</h4>
                        <ul>
                          <li>Audit + recommendations</li>
                          <li>Reusable components + tokens</li>
                          <li>Launch checklist + handoff</li>
                        </ul>
                      </div>
                    </div>

                    <div className="feature-expanded-cta">
                      <button className="primary-btn" onClick={() => (window.location.href = "/contact")}>
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
