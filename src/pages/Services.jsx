export default function Services() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">Services</div>
          <h2>End-to-end support for your brand.</h2>
          <p>
            From first naming explorations to launch-ready marketing sites,
            Brandsap provides a complete service stack.
          </p>
        </div>

        {/* ✅ add wipe-group here */}
        <div className="feature-grid wipe-group">
          {/* ✅ add wipe-ltr to each box */}
          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Strategy</span>
            <h3>Brand foundations</h3>
            <p>
              Positioning, messaging, and naming that align your team and
              resonate with your customers.
            </p>
            <ul>
              <li>Brand workshops</li>
              <li>Narrative & messaging</li>
              <li>Naming explorations</li>
            </ul>
          </article>

          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Design</span>
            <h3>Identity & visuals</h3>
            <p>
              Visual systems made for digital – logo suites, color, and
              components tuned for product UI.
            </p>
            <ul>
              <li>Logo design</li>
              <li>Design tokens & styles</li>
              <li>Component libraries</li>
            </ul>
          </article>

          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Digital</span>
            <h3>Web & launch</h3>
            <p>
              Lightweight, fast websites built in React, tailored to how your
              product team ships.
            </p>
            <ul>
              <li>Marketing sites</li>
              <li>Product story pages</li>
              <li>Interactive demos</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
