// src/components/StickySplitFeatures.jsx
import { useRef } from "react";
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
  // wipe goes left->right (reveals content)
 const wipe = useTransform(progress, [0.08 + delay, 0.40 + delay], [1, 0]);
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

  // 0..1 while you scroll through the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /**
   * Timeline (tweak these to taste)
   * 0.00 - 0.20 : pinned hero card (single)
   * 0.20 - 0.55 : wipe + split starts
   * 0.55 - 1.00 : settles into 3-card layout
   */
  const bgFade = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Big card -> three cards sizing (px)
// width: big -> small across the whole scroll
const w0 = useTransform(scrollYProgress, [0, 1], [860, 360]);
const w1 = useTransform(scrollYProgress, [0, 1], [860, 360]);
const w2 = useTransform(scrollYProgress, [0, 1], [860, 360]);

// x: center -> split across the whole scroll
const x0 = useTransform(scrollYProgress, [0, 1], [0, -380]);
const x1 = useTransform(scrollYProgress, [0, 1], [0, 0]);
const x2 = useTransform(scrollYProgress, [0, 1], [0, 380]);

// opacity stagger (but still completes early and then stays)
const o1 = useTransform(scrollYProgress, [0.05, 0.30], [0, 1]);
const o2 = useTransform(scrollYProgress, [0.12, 0.38], [0, 1]);

// small lift settle
const yLift = useTransform(scrollYProgress, [0, 1], [10, 0]);

  // Optional: slight zoom-out from single to trio
  const scale = useTransform(scrollYProgress, [0.0, 0.55], [1.02, 1]);

  return (
    <section ref={sectionRef} className="sticky-split-section">
      <motion.div className="sticky-split-bg" style={{ opacity: bgFade }} />

      <div className="sticky-split-sticky">
        <div className="container">
          <div className="section-heading section-heading-center sticky-split-heading">
            <div className="pill pill-soft">What we ship</div>
            <h2>Everything your brand needs to launch and grow.</h2>
            <p>
              Scroll to reveal the system — one cohesive offer that expands into
              strategy, design, and digital execution.
            </p>
          </div>

          <motion.div className="sticky-split-stage" style={{ scale }}>
            {/* Card 0 */}
            <motion.article
              className="feature-card glass-card sticky-card"
              style={{ width: w0, x: x0, y: yLift }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
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

            {/* Card 1 (center) */}
            <motion.article
              className="feature-card glass-card sticky-card"
              style={{
                width: w1,
                x: x1,
                opacity: o1,
                y: yLift,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
            >
              <WipeLayer progress={scrollYProgress} delay={0.06} />
              <span className="chip chip-neutral">{FEATURES[1].tag}</span>
              <h3>{FEATURES[1].title}</h3>
              <p>{FEATURES[1].body}</p>
              <ul>
                {FEATURES[1].items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </motion.article>

            {/* Card 2 */}
            <motion.article
              className="feature-card glass-card sticky-card"
              style={{
                width: w2,
                x: x2,
                opacity: o2,
                y: yLift,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
            >
              <WipeLayer progress={scrollYProgress} delay={0.12} />
              <span className="chip chip-neutral">{FEATURES[2].tag}</span>
              <h3>{FEATURES[2].title}</h3>
              <p>{FEATURES[2].body}</p>
              <ul>
                {FEATURES[2].items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </motion.article>
          </motion.div>

          <div className="sticky-split-hint">
            <span className="meta-dot" />
            <span>Keep scrolling — it expands into three lanes.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
