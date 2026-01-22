// src/components/Hero.jsx
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="section hero-section">
      <div className="container hero-grid">
        {/* LEFT SIDE */}
        <div className="hero-copy">
          <div className="OGpill pill-soft hero-pill tectonic-blur">
            Presence • Campaigns • Growth
          </div>

          <h1 className="hero-title tectonic-blur delay-1">
            Local brands,
            <br />
            built to grow online.
          </h1>

          <p className="hero-subtitle tectonic-blur delay-2">
            We build your complete online presence so customers find you, trust
            you, and take action. Websites, e-cards, social media, ads, and
            seasonal campaigns with clear tracking and continuous optimization.
          </p>

          <div className="hero-actions tectonic-blur delay-3">
            <button
              className="primary-btn hero-primary"
              onClick={() => navigate("/contact")}
            >
              Start your growth plan
            </button>

            <button
              className="ghost-btn hero-ghost"
              onClick={() => navigate("/services")}
            >
              Explore services
            </button>
          </div>

          <div className="hero-meta tectonic-blur delay-3">
            <span className="meta-label">Built for local and mid-sized brands</span>
            <span>Setup, launch, and optimize with reporting every month.</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-visual">
          <div className="hero-card hero-card-main glass-card">
            <div className="hero-card-header">
              <span className="chip chip-green">Website + SEO</span>
              <span className="chip chip-neutral">Social + Ads</span>
            </div>

            <div className="hero-card-body">
              <div className="badge-row">
                <div className="badge-pill">
                  <span className="badge-dot" />
                  Google profile and local SEO
                </div>
                <div className="badge-pill">E-cards</div>
                <div className="badge-pill">Campaigns and retargeting</div>
              </div>

              <div className="stacked-panels">
                <div className="panel panel-top">
                  <span className="panel-label">Typical setup time</span>
                  <span className="panel-value">2 to 7 days</span>
                </div>

                <div className="panel panel-middle">
                  <span className="panel-label">Visibility and leads</span>
                  <span className="panel-bar">
                    <span className="panel-bar-fill" />
                  </span>
                </div>

                <div className="panel panel-bottom">
                  <span className="panel-label">What you get</span>
                  <span className="panel-value">More trust, more inquiries</span>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING CARD */}
          <div className="hero-card hero-card-float glass-card">
            <span className="chip chip-purple">Always improving</span>
            <h3 className="hero-card-title">Tracking, reporting, optimization.</h3>
            <p className="hero-card-text">
              We set targets, track calls and leads, and optimize weekly. You always know what’s working.
            </p>
          </div>

          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
        </div>
      </div>
    </section>
  );
}
