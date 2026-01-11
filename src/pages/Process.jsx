const STEPS = [
  {
    title: "Discover",
    body: "We align on goals, audience, and constraints through a focused kickoff and a small set of workshops.",
  },
  {
    title: "Define",
    body: "We translate insights into clear positioning, messaging, and a prioritized roadmap of deliverables.",
  },
  {
    title: "Design",
    body: "We explore options quickly, share live prototypes, and iterate with your team in tight feedback loops.",
  },
  {
    title: "Ship",
    body: "We implement the final system, hand off assets, and support your launch and future iterations.",
  },
];

export default function Process() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">Process</div>
          <h2>Structured like a product sprint.</h2>
          <p>
            Our workflow is simple and predictable so your team always knows
            what’s happening and what’s next.
          </p>
        </div>

        {/* ✅ add wipe-group here */}
        <div className="card-grid wipe-group">
          {STEPS.map((step, index) => (
            // ✅ add wipe-ltr here
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
