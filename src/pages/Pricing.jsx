const PLANS = [
  {
    name: "Starter",
    price: "$3,500",
    tagline: "For early-stage teams shipping their first brand presence.",
    items: ["Single-page site", "Light identity refresh", "2 weeks support"],
  },
  {
    name: "Growth",
    price: "$7,500",
    tagline: "For growing products needing a full story and visual system.",
    items: [
      "Multi-section site",
      "Brand system & guidelines",
      "Priority feedback cycles",
    ],
    highlight: true,
  },
  {
    name: "Partner",
    price: "Custom",
    tagline: "For ongoing design partnership embedded with your team.",
    items: [
      "Dedicated monthly capacity",
      "Design & dev support",
      "Roadmap-based planning",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">Pricing</div>
          <h2>Transparent, project-based engagements.</h2>
          <p>
            No surprise scope creep. We agree on outcomes, timelines, and
            pricing before we start.
          </p>
        </div>

        {/* ✅ add wipe-group here */}
        <div className="feature-grid wipe-group">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={
                "feature-card glass-card wipe-ltr" +
                (plan.highlight ? " feature-card-highlight" : "")
              }
            >
              <span className="chip chip-neutral">{plan.name}</span>
              <h3>{plan.price}</h3>
              <p>{plan.tagline}</p>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
