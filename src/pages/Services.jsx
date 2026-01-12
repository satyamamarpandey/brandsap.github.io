// src/pages/Services.jsx
export default function Services() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">Services</div>
          <h2>Everything you need to grow online, end to end.</h2>
          <p>
            Brandsap helps local businesses and mid-sized brands build a strong
            online presence and turn attention into customers. We set up your
            foundation, launch campaigns, and improve results with clear tracking
            and ongoing optimization.
          </p>
        </div>

        {/* CORE STACK */}
        <div className="feature-grid wipe-group">
          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Foundation</span>
            <h3>Brand clarity and offer messaging</h3>
            <p>
              We simplify your message so people understand what you do, who it is
              for, and why they should choose you. Clear messaging improves every
              page, post, and ad.
            </p>
            <ul>
              <li>Positioning and offer clarity</li>
              <li>Messaging pillars and page structure</li>
              <li>Campaign angles and copy direction</li>
            </ul>
          </article>

          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Presence</span>
            <h3>Website, e-cards, and local discovery</h3>
            <p>
              A modern website and digital sharing assets that make your brand look
              credible. Built for mobile, speed, and conversions, with local
              discovery support where it matters.
            </p>
            <ul>
              <li>Website or landing pages that convert</li>
              <li>Digital e-cards with QR and share links</li>
              <li>Google Business Profile + local SEO basics</li>
            </ul>
          </article>

          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Growth</span>
            <h3>Ads and campaigns that bring customers</h3>
            <p>
              We run search and social campaigns for launches, offers, and seasonal
              moments. Everything is tracked, tested, and improved over time.
            </p>
            <ul>
              <li>Meta and Google ads setup and management</li>
              <li>Seasonal campaigns and special-occasion boosts</li>
              <li>Retargeting for repeat visits and leads</li>
            </ul>
          </article>
        </div>

        {/* ADD-ONS / EXPANDED SERVICES */}
        <div className="section-heading section-heading-center" style={{ marginTop: "3rem" }}>
          <div className="pill pill-soft">More support</div>
          <h2>Extra services to scale faster.</h2>
          <p>
            Add these anytime. They help improve conversions, build trust, and
            keep growth consistent month after month.
          </p>
        </div>

        <div className="feature-grid wipe-group">
          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Local growth</span>
            <h3>Local SEO and reviews setup</h3>
            <p>
              We help customers find you and choose you. Better map visibility, a
              stronger profile, and a clean review flow that builds trust.
            </p>
            <ul>
              <li>Google Business Profile optimization</li>
              <li>Location keywords, citations, and local pages</li>
              <li>QR review card + reply templates</li>
            </ul>
          </article>

          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Conversion</span>
            <h3>Lead capture and booking systems</h3>
            <p>
              Make it easy for customers to contact you, book you, or pay you. We
              set up forms, bookings, and simple lead follow-up flows.
            </p>
            <ul>
              <li>Offer pages and lead capture forms</li>
              <li>Calendly bookings + Razorpay/Stripe payments</li>
              <li>CRM setup + lead follow-up templates</li>
            </ul>
          </article>

          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Content</span>
            <h3>Social content that looks consistent</h3>
            <p>
              Templates and content systems that match your brand. Designed for
              fast posting without losing quality.
            </p>
            <ul>
              <li>Canva templates and social design system</li>
              <li>Short reels plan, product shots, founder intro</li>
              <li>Copywriting for captions and ads</li>
            </ul>
          </article>
        </div>

        {/* PROCESS + PROMISE */}
        <div className="section-heading section-heading-center" style={{ marginTop: "3rem" }}>
          <div className="pill pill-soft">How it works</div>
          <h2>A simple process with clear reporting.</h2>
          <p>
            We set goals early, track key actions, and improve results every month.
            You always know what is working and what we are improving next.
          </p>
        </div>

        <div className="feature-grid wipe-group">
          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Step 1</span>
            <h3>Audit and strategy</h3>
            <p>
              We review your current presence, offers, and visibility. Then we
              build a plan based on your goals and customers.
            </p>
            <ul>
              <li>Quick audit of website and social</li>
              <li>Goal setting and priority roadmap</li>
              <li>Clear next steps and timeline</li>
            </ul>
          </article>

          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Step 2</span>
            <h3>Setup and build</h3>
            <p>
              We build your website, e-cards, profiles, templates, and tracking so
              everything is ready to launch.
            </p>
            <ul>
              <li>Website or landing pages</li>
              <li>E-cards and brand assets</li>
              <li>Tracking setup (GA4, Pixel, events)</li>
            </ul>
          </article>

          <article className="feature-card glass-card wipe-ltr">
            <span className="chip chip-neutral">Step 3</span>
            <h3>Launch and optimize</h3>
            <p>
              We launch campaigns, monitor performance, and improve results with
              testing and monthly reporting.
            </p>
            <ul>
              <li>Ads and seasonal campaigns</li>
              <li>Retargeting and repeat customer flows</li>
              <li>Monthly reporting and optimization</li>
            </ul>
          </article>
        </div>

        {/* CTA */}
        <div className="section-heading section-heading-center" style={{ marginTop: "3rem" }}>
          <h2>Ready to upgrade your online presence?</h2>
          <p>
            Share your goal and timeline. We will respond with next steps and a
            plan that fits your business.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "0.75rem" }}>
            <a className="primary-btn" href="/contact">
              Start a project
            </a>
            <a className="ghost-btn" href="/customers">
              See our work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
