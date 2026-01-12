// src/components/Process.jsx (or src/pages/Process.jsx)

const STEPS = [
  {
    title: "Audit",
    body: "We review your current website, social presence, Google profile, and competitors to find quick wins and gaps.",
  },
  {
    title: "Goals",
    body: "We align on your growth goals, target customers, service area, and what success looks like in simple measurable terms.",
  },
  {
    title: "Build",
    body: "We set up your foundation: website or landing pages, e-cards with QR sharing, and brand templates that stay consistent.",
  },
  {
    title: "Launch",
    body: "We publish the updates, connect tracking, and launch your first campaign or offer so you start getting real signals fast.",
  },
  {
    title: "Promote",
    body: "We run social content and ads across Meta or Google, including retargeting, to bring steady traffic and inquiries.",
  },
  {
    title: "Optimize",
    body: "We report results, test improvements, and optimize monthly so performance keeps moving in the right direction.",
  },
];

export default function Process() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">Process</div>
          <h2>A simple 6-step system for consistent growth.</h2>
          <p>
            Clear steps, clear tracking, and predictable execution. You always
            know what is happening now and what comes next.
          </p>
        </div>

        <div className="card-grid wipe-group">
          {STEPS.map((step, index) => (
            <article key={step.title} className="showcase-card glass-card wipe-ltr">
              <div className="card-label">
                Step {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
