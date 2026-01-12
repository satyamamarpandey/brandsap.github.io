// src/pages/About.jsx
export default function About() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">About Brandsap</div>
          <h2>We help brands grow online with clarity and consistency.</h2>
          <p>
            We partner with local businesses and
            mid-sized brands to build a strong online presence that earns trust
            and drives results. Websites, e-cards, social media, ads, and
            seasonal campaigns, supported by tracking and ongoing optimization.
          </p>
        </div>

        {/* VALUES / PILLARS */}
        <div className="card-grid wipe-group">
          <article className="showcase-card glass-card wipe-ltr">
            <div className="card-label">How we work</div>
            <h3>Clarity first</h3>
            <p>
              We simplify your offer and messaging so customers understand your
              value quickly. Clear positioning improves your website, content,
              and ads at the same time.
            </p>
          </article>

          <article className="showcase-card glass-card wipe-ltr">
            <div className="card-label">What we build</div>
            <h3>A complete online presence</h3>
            <p>
              We create the full foundation, website, e-cards with QR sharing,
              Google profile setup, and social templates so your brand looks
              consistent everywhere.
            </p>
          </article>

          <article className="showcase-card glass-card wipe-ltr">
            <div className="card-label">How growth happens</div>
            <h3>Launch, track, improve</h3>
            <p>
              We set measurable targets early, track key actions like calls and
              form leads, and optimize monthly. You always know what is working
              and what we improve next.
            </p>
          </article>
        </div>

        {/* OPTIONAL: SMALL CTA STRIP (uses your existing button classes) */}
        <div
          className="hero-card hero-card-main glass-card"
          style={{
            maxWidth: 980,
            margin: "2.25rem auto 0",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="card-label">Next step</div>
              <h3 style={{ margin: "0.25rem 0 0.25rem" }}>
                Want a clear plan for your online growth?
              </h3>
              <p style={{ margin: 0, opacity: 0.85 }}>
                Share your business, goals, and timeline. We will reply with
                next steps and a simple plan.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a className="primary-btn" href="/contact">
                Contact us
              </a>
              <a className="ghost-btn" href="/services">
                View services
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
