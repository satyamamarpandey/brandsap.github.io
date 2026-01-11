// src/components/Navbar.jsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/services", label: "Services" },
  { path: "/process", label: "Process" },
  { path: "/pricing", label: "Pricing" },
  { path: "/customers", label: "Customers" },
  { path: "/careers", label: "Careers" },
];

const MOBILE_BP = 900; // keep in sync with CSS breakpoint

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // measure navbar height -> sets --navH
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const setNavH = () => {
      const h = el.getBoundingClientRect().height || 0;
      document.documentElement.style.setProperty("--navH", `${Math.ceil(h)}px`);
    };

    setNavH();

    const ro = new ResizeObserver(setNavH);
    ro.observe(el);

    window.addEventListener("resize", setNavH);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setNavH);
    };
  }, []);

  // close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // lock body scroll when menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // esc to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // if user resizes to desktop, close menu
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= MOBILE_BP) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header
        ref={navRef}
        className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
      >
        <div className="container navbar-inner">
          {/* BRAND */}
          <button
            type="button"
            className="nav-brand-pill"
            onClick={() => navigate("/")}
          >
            <div className="nav-brand-icon">
              <img
                src="/images/B Logo.png"
                alt="Brandsap Logo"
                className="nav-brand-icon-img"
              />
            </div>
            <span className="nav-brand-name">BRANDSAP</span>
          </button>

          {/* DESKTOP NAV */}
          <nav className="nav-desktop">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " nav-link--active" : "")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="nav-actions">
            <button
              type="button"
              className="primary-btn nav-primary"
              onClick={() => navigate("/contact")}
            >
              Contact us
            </button>

            <button
              type="button"
              className="nav-toggle"
              aria-label="Toggle navigation"
              aria-expanded={open}
              aria-controls="mobileNav"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* ✅ IMPORTANT: overlay must be OUTSIDE header (prevents clipping/stacking issues) */}
      <div
        className={`nav-mobile-backdrop ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
      />

      <div
        id="mobileNav"
        className={`nav-mobile sheet ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        {NAV_LINKS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              "nav-link-mobile" + (isActive ? " nav-link--active" : "")
            }
            onClick={() => setOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}

        <button
          type="button"
          className="primary-btn nav-primary mobile-cta"
          onClick={() => {
            setOpen(false);
            navigate("/contact");
          }}
        >
          Contact us
        </button>
      </div>
    </>
  );
}
