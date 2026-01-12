// src/components/ShowcaseSection.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CARDS = [
  {
    id: "strategy",
    label: "Local-first clarity",
    title: "Make your offer instantly clear",
    body: "We help people understand what you do, who it is for, and why they should choose you. Clear messaging that builds trust and drives inquiries.",
  },
  {
    id: "design",
    label: "Credibility upgrade",
    title: "Look premium everywhere",
    body: "A consistent visual system across website, e-cards, and social so your brand feels reliable from the first click and stays recognizable.",
  },
  {
    id: "digital",
    label: "Growth setup",
    title: "Turn traffic into customers",
    body: "We build fast pages, lead capture, and tracking so you can run offers, campaigns, and ads with confidence and improve results month after month.",
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
          <div className="pill pill-outline">Built for local & mid brands</div>
          <h2>Online presence that looks trusted and grows.</h2>
        </div>

        <p>
          Brandsap helps businesses show up professionally online with a complete setup:
          website, e-cards, social profiles, campaigns, and tracking. Clear deliverables,
          clean execution, and steady improvement.
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

          // When active, we "remove" the source card so the shared element can travel
          if (isActive) return <div key={card.id} className="showcase-placeholder" />;

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
              {/* Premium wipe */}
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
                    navigate("/services");
                  }}
                >
                  See what’s included <span>↗</span>
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
