import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

export default function StickySplitFeatures() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Desktop: fade bg in fast
  const bgFade = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  // Desktop animation end
  const tEnd = 0.35;

  // ✅ Desktop fit math (prevents overlap + prevents off-screen)
  const [fit, setFit] = useState({ endW: 380, spread: 520 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const gutter = 28; // safe inner padding
    const gap = 28; // space between cards at settled state

    const compute = () => {
      const w = el.getBoundingClientRect().width || window.innerWidth;

      // Ensure 3 cards + 2 gaps fit within stage (minus gutters)
      const maxEndW = Math.floor((w - 2 * gutter - 2 * gap) / 3);

      // Clamp for premium look, but shrink if needed
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

  // Desktop: widths shrink
  const w0 = useTransform(scrollYProgress, [0, tEnd], [860, fit.endW]);
  const w1 = useTransform(scrollYProgress, [0, tEnd], [860, fit.endW]);
  const w2 = useTransform(scrollYProgress, [0, tEnd], [860, fit.endW]);

  // Desktop: spread out
  const x0 = useTransform(scrollYProgress, [0, tEnd], [0, -fit.spread]);
  const x1 = useTransform(scrollYProgress, [0, tEnd], [0, 0]);
  const x2 = useTransform(scrollYProgress, [0, tEnd], [0, fit.spread]);

  // Desktop: fade in cards 2/3
  const o1 = useTransform(scrollYProgress, [0.04, 0.12], [0, 1]);
  const o2 = useTransform(scrollYProgress, [0.07, 0.15], [0, 1]);

  const yLift = useTransform(scrollYProgress, [0, tEnd], [10, 0]);
  const scale = useTransform(scrollYProgress, [0, tEnd], [1.02, 1]);

  return (
    <section ref={sectionRef} className="sticky-split-section">
      <motion.div className="sticky-split-bg" style={{ opacity: bgFade }} />

      {/* =========================
          ✅ DESKTOP (sticky split)
         ========================= */}
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
              style={{ scale }}
            >
              <div className="sticky-card-wrap" style={{ zIndex: 1 }}>
                <motion.article
                  className="feature-card glass-card sticky-card"
                  style={{ width: w0, x: x0, y: yLift }}
                >
                  <WipeLayer progress={scrollYProgress} delay={0.0} />
                  <span className="chip chip-neutral">{FEATURES[0].tag}</span>
                  <h3>{FEATURES[0].title}</h3>
                  <p>{FEATURES[0].body}</p>
                  <ul>
                    {FEATURES[0].items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </motion.article>
              </div>

              <div className="sticky-card-wrap" style={{ zIndex: 2 }}>
                <motion.article
                  className="feature-card glass-card sticky-card"
                  style={{ width: w1, x: x1, opacity: o1, y: yLift }}
                >
                  <WipeLayer progress={scrollYProgress} delay={0.03} />
                  <span className="chip chip-neutral">{FEATURES[1].tag}</span>
                  <h3>{FEATURES[1].title}</h3>
                  <p>{FEATURES[1].body}</p>
                  <ul>
                    {FEATURES[1].items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </motion.article>
              </div>

              <div className="sticky-card-wrap" style={{ zIndex: 3 }}>
                <motion.article
                  className="feature-card glass-card sticky-card"
                  style={{ width: w2, x: x2, opacity: o2, y: yLift }}
                >
                  <WipeLayer progress={scrollYProgress} delay={0.06} />
                  <span className="chip chip-neutral">{FEATURES[2].tag}</span>
                  <h3>{FEATURES[2].title}</h3>
                  <p>{FEATURES[2].body}</p>
                  <ul>
                    {FEATURES[2].items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </motion.article>
              </div>
            </motion.div>

            <div className="sticky-split-hint">
              <span className="meta-dot" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          ✅ MOBILE (vertical reveal)
         ========================= */}
      <div className="sticky-split-mobile">
        <div className="container">
          <div className="section-heading section-heading-center sticky-split-heading">
            <div className="pill pill-soft">What we ship</div>
            <h2>Everything your brand needs to launch and grow.</h2>
            <p>
              Scroll to reveal the system — one cohesive offer that expands into
              strategy, design, and digital execution.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: 16,
              maxWidth: 520,
              margin: "0 auto",
              paddingBottom: 8,
            }}
          >
            {FEATURES.map((f, idx) => (
              <motion.article
                key={f.id}
                className="feature-card glass-card"
                initial={{ opacity: 0, y: -18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: idx * 0.06,
                }}
              >
                <span className="chip chip-neutral">{f.tag}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                <ul>
                  {f.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
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
