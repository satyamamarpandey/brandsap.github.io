// src/components/ShowcaseSection.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CARDS = [
  {
    id: "strategy",
    label: "Purpose-built",
    title: "Built for product-led brands",
    body: "Position your brand around outcomes, not buzzwords. Clear messaging, sharp visuals, and interfaces that feel instantly familiar.",
  },
  {
    id: "design",
    label: "Fast execution",
    title: "Move from idea to launch quickly",
    body: "We design and build in parallel – so you can review live prototypes early, iterate fast, and launch on time.",
  },
  {
    id: "digital",
    label: "Crafted detail",
    title: "Delight in the micro-interactions",
    body: "Hover states, transitions, and micro-copy are treated as first-class citizens, not afterthoughts.",
  },
];

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45 } },
};

export default function ShowcaseSection({ activeId, onSelect }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="section-heading">
        <div>
          <div className="pill pill-outline">Made for modern teams</div>
          <h2>Product-grade brand experiences</h2>
        </div>
        <p>
          Brandsap combines product thinking with visual design. The result is a
          website that feels as polished and responsive as your product.
        </p>
      </div>

      <motion.div
        className="card-grid"
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        {CARDS.map((card) => {
          const isActive = activeId === card.id;

          // When active, we "remove" the source card so the shared element can
          // travel to the FeatureSection (same layoutId, different place).
          if (isActive) {
            return <div key={card.id} className="showcase-placeholder" />;
          }

          return (
            <motion.article
              key={card.id}
              variants={cardVariants}
              layout
              layoutId={`shared-card-${card.id}`}
              className="showcase-card glass-card"
              onClick={() => onSelect(card.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelect(card.id)}
            >
              {/* Optional: wipe layer (looks premium) */}
              <motion.span
                className="card-wipe"
                initial={{ scaleX: 1 }}
                whileInView={{ scaleX: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              <div className="card-label">{card.label}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>

              <div className="card-actions">
                <button
                  className="text-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/process");
                  }}
                >
                  Learn more <span>↗</span>
                </button>

                <button
                  className="ghost-btn card-ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(card.id);
                  }}
                >
                  Expand
                </button>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </div>
  );
}
