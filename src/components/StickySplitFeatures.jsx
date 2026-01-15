import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ✅ SHORTER + TIGHTER CONTENT (so it fits clean) */
const FEATURES = [
  {
    id: "strategy",
    tag: "Strategy",
    title: "Brand foundations",
    body:
      "Clarify your offer, audience, and why customers choose you. Built to improve trust and conversion.",
    items: [
      "Positioning & narrative",
      "Offer clarity (what + for who)",
      "Messaging pillars + CTAs",
      "Local + competitor scan",
      "Service packages + pricing",
      "Launch roadmap",
      "Content direction",
      "Tone & voice guide",
    ],
    idealFor: "Local businesses & new brands",
    timeline: "2 to 4 days",
  },
  {
    id: "design",
    tag: "Design",
    title: "Visual identity",
    body:
      "A premium look across website + social. Built to feel credible from day one.",
    items: [
      "Logo suite (primary + alt)",
      "Color + typography system",
      "Patterns + icon style",
      "Web design tokens",
      "Canva templates",
      "E-card (QR + links)",
      "Profile visuals pack",
      "Basic brand guidelines",
    ],
    idealFor: "Shops, cafes, clinics, creators",
    timeline: "3 to 7 days",
  },
  {
    id: "digital",
    tag: "Digital",
    title: "Website & growth setup",
    body:
      "A fast mobile-first website with local visibility, lead capture, and tracking.",
    items: [
      "Website build (key pages)",
      "Google Business Profile",
      "Local SEO basics",
      "WhatsApp Business setup",
      "Lead forms + booking links",
      "Tracking (GA4 + events)",
      "Campaign landing pages",
      "Retargeting readiness",
    ],
    idealFor: "Businesses ready to grow",
    timeline: "1 to 2 weeks",
  },
];

function WipeLayer({ progress, delay = 0 }) {
  const wipe = useTransform(progress, [0.03 + delay, 0.14 + delay], [1, 0]);
  return (
    <motion.span
      className="wipe-layer"
      style={{ scaleX: wipe }}
      aria-hidden="true"
    />
  );
}

/** ✅ TIGHT LIST + ALWAYS FITS */
function ListWithMore({
  items,
  max = 5,
  ulStyle = {},
  liStyle = {},
  moreStyle = {},
}) {
  const shown = items.slice(0, max);
  const remaining = Math.max(0, items.length - max);

  return (
    <ul
      style={{
        margin: "10px 0 0",
        paddingLeft: 18,
        display: "grid",
        gap: 5,
        ...ulStyle,
      }}
    >
      {shown.map((it) => (
        <li
          key={it}
          style={{
            fontSize: 14,
            lineHeight: 1.22,
            opacity: 0.92,
            ...liStyle,
          }}
        >
          {it}
        </li>
      ))}

      {remaining ? (
        <li
          className="list-more"
          style={{
            listStyle: "none",
            marginLeft: -18,
            fontSize: 13.5,
            opacity: 0.72,
            lineHeight: 1.15,
            ...moreStyle,
          }}
        >
          + {remaining} more included
        </li>
      ) : null}
    </ul>
  );
}

export default function StickySplitFeatures() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgFade = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const tEnd = 0.35;

  const [fit, setFit] = useState({ endW: 380, spread: 520 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const gutter = 28;
    const gap = 28;

    const compute = () => {
      const w = el.getBoundingClientRect().width || window.innerWidth;
      const maxEndW = Math.floor((w - 2 * gutter - 2 * gap) / 3);
      const endW = Math.max(300, Math.min(380, maxEndW));
      const spread = endW + gap;
      setFit({ endW, spread });
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  const w0 = useTransform(scrollYProgress, [0, tEnd], [860, fit.endW]);
  const w1 = useTransform(scrollYProgress, [0, tEnd], [860, fit.endW]);
  const w2 = useTransform(scrollYProgress, [0, tEnd], [860, fit.endW]);

  const x0 = useTransform(scrollYProgress, [0, tEnd], [0, -fit.spread]);
  const x1 = useTransform(scrollYProgress, [0, tEnd], [0, 0]);
  const x2 = useTransform(scrollYProgress, [0, tEnd], [0, fit.spread]);

  const o1 = useTransform(scrollYProgress, [0.04, 0.12], [0, 1]);
  const o2 = useTransform(scrollYProgress, [0.07, 0.15], [0, 1]);

  const yLift = useTransform(scrollYProgress, [0, tEnd], [10, 0]);
  const scale = useTransform(scrollYProgress, [0, tEnd], [1.02, 1]);

  /** ✅ Desktop-only typography + spacing tuning (FINAL FIT) */
  const cardBaseStyle = {
    borderRadius: 32,
    overflow: "hidden",
    padding: "20px 20px 14px",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 40px 130px rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
  };

  const chipStyle = {
    fontSize: 12.5,
    padding: "6px 12px",
    borderRadius: 999,
    opacity: 0.92,
  };

  const titleStyle = {
    margin: "10px 0 8px",
    fontSize: 24,
    lineHeight: 1.12,
    letterSpacing: "0.005em",
  };

  const bodyStyle = {
    margin: "0 0 6px",
    fontSize: 14.5,
    lineHeight: 1.42,
    opacity: 0.76,
    maxWidth: 520,
  };

  const footerStyle = {
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.10)",
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
  };

  const footerMetaStyle = {
    display: "grid",
    gap: 5,
    minWidth: 0,
  };

  const footerLabelStyle = {
    fontSize: 10.5,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    opacity: 0.6,
  };

  const footerValueStyle = {
    fontSize: 14.5,
    fontWeight: 650,
    lineHeight: 1.15,
  };

  return (
    <>
      <section ref={sectionRef} className="sticky-split-section">
        <motion.div className="sticky-split-bg" style={{ opacity: bgFade }} />

        {/* DESKTOP */}
        <div className="sticky-split-desktop">
          <div className="sticky-split-sticky">
            <div className="container">
              <div className="section-heading section-heading-center sticky-split-heading">
                <div className="pill pill-soft">What we ship</div>
                <h2>Everything your brand needs to launch and grow.</h2>
              </div>

              <motion.div
                ref={stageRef}
                className="sticky-split-stage"
                style={{
                  scale,
                  marginBottom: 62,
                }}
              >
                {/* Card 1 */}
                <div className="sticky-card-wrap" style={{ zIndex: 1 }}>
                  <motion.article
                    className="feature-card glass-card sticky-card"
                    style={{
                      width: w0,
                      x: x0,
                      y: yLift,
                      ...cardBaseStyle,
                    }}
                  >
                    <WipeLayer progress={scrollYProgress} delay={0.0} />

                    <span className="chip chip-neutral" style={chipStyle}>
                      {FEATURES[0].tag}
                    </span>

                    <h3 style={titleStyle}>{FEATURES[0].title}</h3>
                    <p style={bodyStyle}>{FEATURES[0].body}</p>

                    <ListWithMore items={FEATURES[0].items} max={5} />

                    <div className="sticky-card-footer" style={footerStyle}>
                      <div className="footer-meta" style={footerMetaStyle}>
                        <span className="footer-label" style={footerLabelStyle}>
                          Ideal for
                        </span>
                        <span className="footer-value" style={footerValueStyle}>
                          {FEATURES[0].idealFor}
                        </span>
                      </div>
                      <div className="footer-meta" style={footerMetaStyle}>
                        <span className="footer-label" style={footerLabelStyle}>
                          Typical timeline
                        </span>
                        <span className="footer-value" style={footerValueStyle}>
                          {FEATURES[0].timeline}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </div>

                {/* Card 2 */}
                <div className="sticky-card-wrap" style={{ zIndex: 2 }}>
                  <motion.article
                    className="feature-card glass-card sticky-card"
                    style={{
                      width: w1,
                      x: x1,
                      opacity: o1,
                      y: yLift,
                      ...cardBaseStyle,
                    }}
                  >
                    <WipeLayer progress={scrollYProgress} delay={0.03} />

                    <span className="chip chip-neutral" style={chipStyle}>
                      {FEATURES[1].tag}
                    </span>

                    <h3 style={titleStyle}>{FEATURES[1].title}</h3>
                    <p style={bodyStyle}>{FEATURES[1].body}</p>

                    <ListWithMore items={FEATURES[1].items} max={5} />

                    <div className="sticky-card-footer" style={footerStyle}>
                      <div className="footer-meta" style={footerMetaStyle}>
                        <span className="footer-label" style={footerLabelStyle}>
                          Ideal for
                        </span>
                        <span className="footer-value" style={footerValueStyle}>
                          {FEATURES[1].idealFor}
                        </span>
                      </div>
                      <div className="footer-meta" style={footerMetaStyle}>
                        <span className="footer-label" style={footerLabelStyle}>
                          Typical timeline
                        </span>
                        <span className="footer-value" style={footerValueStyle}>
                          {FEATURES[1].timeline}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </div>

                {/* Card 3 */}
                <div className="sticky-card-wrap" style={{ zIndex: 3 }}>
                  <motion.article
                    className="feature-card glass-card sticky-card"
                    style={{
                      width: w2,
                      x: x2,
                      opacity: o2,
                      y: yLift,
                      ...cardBaseStyle,
                    }}
                  >
                    <WipeLayer progress={scrollYProgress} delay={0.06} />

                    <span className="chip chip-neutral" style={chipStyle}>
                      {FEATURES[2].tag}
                    </span>

                    <h3 style={titleStyle}>{FEATURES[2].title}</h3>
                    <p style={bodyStyle}>{FEATURES[2].body}</p>

                    <ListWithMore items={FEATURES[2].items} max={5} />

                    <div className="sticky-card-footer" style={footerStyle}>
                      <div className="footer-meta" style={footerMetaStyle}>
                        <span className="footer-label" style={footerLabelStyle}>
                          Ideal for
                        </span>
                        <span className="footer-value" style={footerValueStyle}>
                          {FEATURES[2].idealFor}
                        </span>
                      </div>
                      <div className="footer-meta" style={footerMetaStyle}>
                        <span className="footer-label" style={footerLabelStyle}>
                          Typical timeline
                        </span>
                        <span className="footer-value" style={footerValueStyle}>
                          {FEATURES[2].timeline}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </div>
              </motion.div>

              <div className="sticky-split-hint">
                <span className="meta-dot" />
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE (KEEP INTACT ✅) */}
        <div className="sticky-split-mobile">
          <div className="container">
            <div className="section-heading section-heading-center sticky-split-heading">
              <div className="pill pill-soft">What we ship</div>
              <h2>Everything your brand needs to launch and grow.</h2>
              <p>
                Strategy, design, and website setup built for local visibility and better conversion.
                Simple, clear, and easy to maintain.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: 16,
                maxWidth: 560,
                margin: "0 auto",
                paddingBottom: 8,
              }}
            >
              {FEATURES.map((f, idx) => (
                <motion.article
                  key={f.id}
                  className="feature-card glass-card sticky-card"
                  initial={{ opacity: 0, y: -18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.06 }}
                >
                  <span className="chip chip-neutral">{f.tag}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>

                  <ul>
                    {f.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>

                  <div className="sticky-card-footer">
                    <div className="footer-meta">
                      <span className="footer-label">Ideal for</span>
                      <span className="footer-value">{f.idealFor}</span>
                    </div>
                    <div className="footer-meta">
                      <span className="footer-label">Typical timeline</span>
                      <span className="footer-value">{f.timeline}</span>
                    </div>
                  </div>

                  <div className="sticky-mobile-cta">
                    <a
                      className="primary-btn"
                      href="/contact"
                      style={{ width: "100%", textAlign: "center" }}
                    >
                      Start building
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="sticky-split-hint">
              <span className="meta-dot" />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ footer push-down spacer */}
      <div style={{ height: 50 }} aria-hidden="true" />
    </>
  );
}
