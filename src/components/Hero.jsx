// src/components/Hero.jsx
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="section hero-section">
      <div className="container hero-grid">
        {/* LEFT SIDE */}
        <div className="hero-copy">
          <div className="pill pill-soft hero-pill tectonic-blur">
            <span className="pill-dot" />
            BRANDSAP STUDIO • Brand • Strategy • Web
          </div>

          <h1 className="hero-title tectonic-blur delay-1">
            Build a brand
            <br />
            people remember.
          </h1>

          <p className="hero-subtitle tectonic-blur delay-2">
            We create clear positioning, confident identity, and modern websites
            that feel premium and drive action. Ideal for founders, creators,
            and teams launching or leveling up.
          </p>

          <div className="hero-actions tectonic-blur delay-3">
            <button
              className="primary-btn hero-primary"
              onClick={() => navigate("/contact")}
            >
              Start a project
            </button>

            <button
              className="ghost-btn hero-ghost"
              onClick={() => navigate("/services")}
            >
              Explore services
            </button>
          </div>

          <div className="hero-meta tectonic-blur delay-3">
            <span className="meta-label">Fast, focused, and launch ready</span>
            <span className="meta-dot" />
            <span>Strategy, design, and web in one place.</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-visual">
          <div className="hero-card hero-card-main glass-card">
            <div className="hero-card-header">
              <span className="chip chip-green">Brand system</span>
              <span className="chip chip-neutral">Website build</span>
            </div>

            <div className="hero-card-body">
              <div className="badge-row">
                <div className="badge-pill">
                  <span className="badge-dot" />
                  Identity + guidelines
                </div>
                <div className="badge-pill">Landing pages</div>
                <div className="badge-pill">Copy refresh</div>
              </div>

              <div className="stacked-panels">
                <div className="panel panel-top">
                  <span className="panel-label">Typical timeline</span>
                  <span className="panel-value">4 to 6 weeks</span>
                </div>

                <div className="panel panel-middle">
                  <span className="panel-label">Brand clarity</span>
                  <span className="panel-bar">
                    <span className="panel-bar-fill" />
                  </span>
                </div>

                <div className="panel panel-bottom">
                  <span className="panel-label">Conversion focus</span>
                  <span className="panel-value">Clean UX, clear CTA</span>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING CARD */}
          <div className="hero-card hero-card-float glass-card">
            <span className="chip chip-purple">Launch ready</span>
            <h3 className="hero-card-title">Premium web experiences</h3>
            <p className="hero-card-text">
              Smooth motion, sharp layouts, and messaging that makes your value
              obvious in seconds. Built to look great on mobile and desktop.
            </p>
          </div>

          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
        </div>
      </div>
    </section>
  );
}
