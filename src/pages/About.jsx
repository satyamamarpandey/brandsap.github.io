export default function About() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">About Brandsap</div>
          <h2>Design studio for modern product teams.</h2>
          <p>
            Brandsap is built by Satyam and focuses on branding, strategy, and
            digital execution.
          </p>
        </div>

        {/* ✅ add wipe-group here */}
        <div className="card-grid wipe-group">
          {/* ✅ add wipe-ltr to each box */}
          <article className="showcase-card glass-card wipe-ltr">
            <div className="card-label">Approach</div>
            <h3>Strategy first</h3>
            <p>
              Every engagement starts with understanding your product, your
              customers, and the story you want to tell.
            </p>
          </article>

          <article className="showcase-card glass-card wipe-ltr">
            <div className="card-label">Collaboration</div>
            <h3>Embed with your team</h3>
            <p>
              We work inside your tools and rituals so decisions are fast and
              context is shared.
            </p>
          </article>

          <article className="showcase-card glass-card wipe-ltr">
            <div className="card-label">Outcome</div>
            <h3>Systems, not one-offs</h3>
            <p>
              Instead of isolated screens, we ship reusable components and
              guidelines that grow with your product.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
