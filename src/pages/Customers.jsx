const CUSTOMERS = [
  {
    name: "SprintStack",
    role: "Dev tools startup",
    quote:
      "Brandsap helped us move from a generic landing page to a product-grade brand in just a few weeks.",
  },
  {
    name: "Northline",
    role: "Fintech platform",
    quote:
      "The new site finally explains what we do in a way that resonates with both users and investors.",
  },
  {
    name: "OrbitLab",
    role: "AI studio",
    quote:
      "Every detail – from microcopy to hover states – feels intentional and on brand.",
  },
];

export default function Customers() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">Customers</div>
          <h2>Trusted by product-led teams.</h2>
          <p>
            We work closely with founders, PMs, and design leaders who want
            their brand to feel as refined as their product.
          </p>
        </div>

        {/* ✅ add wipe-group here */}
        <div className="card-grid wipe-group">
          {CUSTOMERS.map((c) => (
            // ✅ add wipe-ltr here
            <article key={c.name} className="showcase-card glass-card wipe-ltr">
              <div className="card-label">{c.role}</div>
              <h3>{c.name}</h3>
              <p>{c.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
