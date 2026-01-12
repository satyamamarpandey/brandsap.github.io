import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const FEATURES = [
  {
    id: "strategy",
    tag: "Strategy",
    title: "Brand foundations",
    body:
      "Clarify what you offer, who it is for, and why customers should choose you. Built to improve trust and conversion.",
    items: [
      "Positioning & narrative",
      "Offer clarity (what you do + for who)",
      "Messaging pillars + CTAs",
      "Local and competitor scan",
      "Service menu / package structure",
      "Launch roadmap (what to do first)",
      "Content direction (what to post weekly)",
      "Tone and voice guide",
    ],
    idealFor: "Local businesses and new brands",
    timeline: "2 to 4 days",
  },
  {
    id: "design",
    tag: "Design",
    title: "Visual identity",
    body:
      "A consistent premium look across website, social, ads, and print. Designed to feel credible from day one.",
    items: [
      "Logo suite (primary + alternate)",
      "Color palette + typography",
      "Brand patterns + icons",
      "Design tokens for web",
      "Canva templates (posts, stories, flyers)",
      "E-card design (QR + share links)",
      "Profile visuals (DP, highlights, covers)",
      "Brand kit + basic guidelines",
    ],
    idealFor: "Shops, cafes, clinics, creators",
    timeline: "3 to 7 days",
  },
  {
    id: "digital",
    tag: "Digital",
    title: "Website & growth setup",
    body:
      "A fast mobile-first website, local visibility setup, lead capture, and tracking. Built to bring inquiries and customers.",
    items: [
      "Website build (landing + key pages)",
      "Google Business Profile optimization",
      "Local SEO basics (keywords + structure)",
      "WhatsApp Business setup (catalog + quick replies)",
      "Lead forms + booking links",
      "Tracking setup (GA4, pixel, events)",
      "Campaign pages (offers, festivals, launches)",
      "Retargeting readiness (audiences + pixel)",
    ],
    idealFor: "Businesses ready to grow",
    timeline: "1 to 2 weeks",
  },
];

function WipeLayer({ progress, delay = 0 }) {
  const wipe = useTransform(progress, [0.03 + delay, 0.14 + delay], [1, 0]);
  return (
    <motion.span className="wipe-layer" style={{ scaleX: wipe }} aria-hidden="true" />
  );
}

function ListWithMore({ items, max = 6 }) {
  const shown = items.slice(0, max);
  const remaining = Math.max(0, items.length - max);

  return (
    <ul>
      {shown.map((it) => (
        <li key={it}>{it}</li>
      ))}
      {remaining ? (
        <li className="list-more">+ {remaining} more included</li>
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

  return (
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

            <motion.div ref={stageRef} className="sticky-split-stage" style={{ scale }}>
              {/* Card 1 */}
              <div className="sticky-card-wrap" style={{ zIndex: 1 }}>
                <motion.article
                  className="feature-card glass-card sticky-card"
                  style={{ width: w0, x: x0, y: yLift }}
                >
                  <WipeLayer progress={scrollYProgress} delay={0.0} />
                  <span className="chip chip-neutral">{FEATURES[0].tag}</span>
                  <h3>{FEATURES[0].title}</h3>
                  <p>{FEATURES[0].body}</p>

                  <ListWithMore items={FEATURES[0].items} max={6} />

                  <div className="sticky-card-footer">
                    <div className="footer-meta">
                      <span className="footer-label">Ideal for</span>
                      <span className="footer-value">{FEATURES[0].idealFor}</span>
                    </div>
                    <div className="footer-meta">
                      <span className="footer-label">Typical timeline</span>
                      <span className="footer-value">{FEATURES[0].timeline}</span>
                    </div>
                  </div>
                </motion.article>
              </div>

              {/* Card 2 */}
              <div className="sticky-card-wrap" style={{ zIndex: 2 }}>
                <motion.article
                  className="feature-card glass-card sticky-card"
                  style={{ width: w1, x: x1, opacity: o1, y: yLift }}
                >
                  <WipeLayer progress={scrollYProgress} delay={0.03} />
                  <span className="chip chip-neutral">{FEATURES[1].tag}</span>
                  <h3>{FEATURES[1].title}</h3>
                  <p>{FEATURES[1].body}</p>

                  <ListWithMore items={FEATURES[1].items} max={6} />

                  <div className="sticky-card-footer">
                    <div className="footer-meta">
                      <span className="footer-label">Ideal for</span>
                      <span className="footer-value">{FEATURES[1].idealFor}</span>
                    </div>
                    <div className="footer-meta">
                      <span className="footer-label">Typical timeline</span>
                      <span className="footer-value">{FEATURES[1].timeline}</span>
                    </div>
                  </div>
                </motion.article>
              </div>

              {/* Card 3 */}
              <div className="sticky-card-wrap" style={{ zIndex: 3 }}>
                <motion.article
                  className="feature-card glass-card sticky-card"
                  style={{ width: w2, x: x2, opacity: o2, y: yLift }}
                >
                  <WipeLayer progress={scrollYProgress} delay={0.06} />
                  <span className="chip chip-neutral">{FEATURES[2].tag}</span>
                  <h3>{FEATURES[2].title}</h3>
                  <p>{FEATURES[2].body}</p>

                  <ListWithMore items={FEATURES[2].items} max={6} />

                  <div className="sticky-card-footer">
                    <div className="footer-meta">
                      <span className="footer-label">Ideal for</span>
                      <span className="footer-value">{FEATURES[2].idealFor}</span>
                    </div>
                    <div className="footer-meta">
                      <span className="footer-label">Typical timeline</span>
                      <span className="footer-value">{FEATURES[2].timeline}</span>
                    </div>
                  </div>
                </motion.article>
              </div>
            </motion.div>

            {/* Optional CTA row under cards (adds trust + direction) */}
            <div className="sticky-split-cta-row">
              <a className="primary-btn" href="/pricing">
                See plans
              </a>
              <a className="ghost-btn" href="/contact">
                Talk to us
              </a>
            </div>

            <div className="sticky-split-hint">
              <span className="meta-dot" />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
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
                  <a className="primary-btn" href="/contact" style={{ width: "100%", textAlign: "center" }}>
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
  );
}
