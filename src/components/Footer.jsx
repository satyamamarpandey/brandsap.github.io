// src/components/Footer.jsx
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer id="contact" className="footer">
      <div className="container footer-inner">
        {/* LEFT SIDE */}
        <div className="footer-left">
          <div className="footer-brand-pill">
            <span className="brand-mark" />
            <span className="footer-brand-name">Brandsap</span>
        </div>
          <p className="footer-text">
            A small studio helping product-led teams craft brands and websites
            that feel as focused as the products behind them.
          </p>
          <p className="footer-text-sub">
            Strategy, identity, and web experience, shipped together as one
            clear story.
          </p>
        </div>

        {/* RIGHT SIDE – NAV COLUMNS */}
        <div className="footer-right">
          {/* Services / Features */}
          <div className="footer-column">
            <h4>Services</h4>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Brand foundations
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Visual identity
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Website pages
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Launch campaigns
            </button>
          </div>

          {/* Product / Offerings */}
          <div className="footer-column">
            <h4>Packages</h4>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Startup sprint
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Rebrand refresh
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Web overhaul
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Ongoing support
            </button>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4>Company</h4>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/about")}
            >
              About
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Case studies
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/about")}
            >
              Process
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/contact")}
            >
              FAQs
            </button>
          </div>

          {/* Resources */}
          <div className="footer-column">
            <h4>Resources</h4>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/contact")}
            >
              Project enquiry
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Brand checklist
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => navigate("/services")}
            >
              Website prep guide
            </button>
          </div>

          {/* Connect */}
          <div className="footer-column">
            <h4>Connect</h4>
            <a
              className="footer-link"
              href="mailto:7satyampandey@gmail.com"
            >
              7satyampandey@gmail.com
            </a>
            <a
              className="footer-link"
              href="https://www.instagram.com/_beast_/#"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              className="footer-link"
              href="https://www.linkedin.com/in/pandeysatyam/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="footer-link"
              href="https://github.com/satyamamarpandey"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
        <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} Brandsap Studio</span>
            <span className="footer-dot">•</span>
            <span>Brand · Strategy · Web</span>
            <span className="footer-dot">•</span>
            <p className="footer-built">
              Built by{" "}
              <a
                href="https://pandeysatyam.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-creator"
              >
                Satyam Pandey
              </a>
              .
            </p>
          </div>

            <div className="footer-bottom-right">
            {/* Optional small links (can point to real routes later) */}
            
            <button
                type="button"
                className="footer-bottom-link"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                Back to top
            </button>            
            </div>
        </div>
        </div>

    </footer>
  );
}
