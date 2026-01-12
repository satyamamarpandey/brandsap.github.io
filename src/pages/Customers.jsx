// src/components/Customers.jsx

const FEATURED_WORK = [
  {
    name: "Knowledge Home",
    role: "NGO website and donation platform",
    quote:
      "Built a modern brand presence with a clear mission story, trust-first design, and donation-friendly flows.",
    tags: ["Brand", "Website", "Donations", "SEO"],
  },
  {
    name: "H-1B Wage Insights",
    role: "Data-driven web app",
    quote:
      "Created a clean product UI that makes complex data feel simple, with clarity-first UX and performance focus.",
    tags: ["Web app", "Data UX", "Product"],
  },
  {
    name: "Personal Portfolio",
    role: "Personal brand website",
    quote:
      "Built a polished portfolio that communicates capabilities, projects, and credibility in a single flow.",
    tags: ["Website", "Personal brand"],
  },
  {
    name: "Gyan Vidya Mandir",
    role: "School website",
    quote:
      "Structured admissions and school information to be easy to browse, mobile-first, and parent-friendly.",
    tags: ["Website", "Admissions", "Local SEO"],
  },
  {
    name: "Pathfinder AI",
    role: "Resume and career analysis platform",
    quote:
      "Designed a product-led experience that feels modern, guided, and simple to use from the first screen.",
    tags: ["Product UI", "Website", "Flows"],
  },
  {
    name: "Mail-Stream",
    role: "Email automation platform",
    quote:
      "Created a crisp interface for automation workflows, dashboards, and structured setup paths.",
    tags: ["Dashboard", "UX", "Automation"],
  },
  {
    name: "Amazeballs",
    role: "Business website and online presence",
    quote:
      "Built a strong local presence foundation with messaging, clean layout, and high-clarity content structure.",
    tags: ["Website", "Local presence", "Brand"],
  },
  {
    name: "Anumit",
    role: "Digital business card and NFC platform",
    quote:
      "Designed a clean, fast, and shareable experience for digital cards with strong profile presentation.",
    tags: ["E-card", "NFC", "Landing pages"],
  },
  {
    name: "Ascent-DT",
    role: "Data and technology website",
    quote:
      "Created a modern, credible website that positions the brand clearly and supports lead generation.",
    tags: ["Website", "B2B", "Lead flow"],
  },
];

// Helper for “example names” (clearly labeled)
const EX = (name) => `${name} (Example)`;

// Very local examples (explicitly “Example” so we are not claiming they are real clients)
const LOCAL_EXAMPLES = [
  {
    name: EX("Maple Bean Cafe"),
    role: "Cafe",
    quote:
      "Set up Google Business Profile, added photo structure, created a menu landing page, and built a QR review flow for quick feedback.",
    tags: ["Google profile", "Menu page", "Reviews", "Local SEO"],
    isExample: true,
  },
  {
    name: EX("Sunrise Breakfast Spot"),
    role: "Breakfast and brunch",
    quote:
      "Built a fast website with location, timings, and WhatsApp ordering. Added offer pages for weekend specials and seasonal promos.",
    tags: ["Website", "WhatsApp", "Offers", "Mobile-first"],
    isExample: true,
  },
  {
    name: EX("Spice Corner Snacks"),
    role: "Snacks and quick bites",
    quote:
      "Created a simple one-page website with bestsellers, pricing, and directions. Added shareable e-card with QR and click-to-call.",
    tags: ["One-page site", "E-card", "QR", "Click-to-call"],
    isExample: true,
  },
  {
    name: EX("Green Leaf Juice Bar"),
    role: "Juice bar",
    quote:
      "Designed a clean brand look for the counter, online menu, story templates, and a weekly posting plan with boosted stories.",
    tags: ["Brand kit", "Templates", "Stories", "Boost"],
    isExample: true,
  },
  {
    name: EX("City Chaat House"),
    role: "Restaurant",
    quote:
      "Improved local visibility with map ranking basics, keyword pages for popular dishes, and a reviews system with response templates.",
    tags: ["Local SEO", "Keywords", "Reviews", "Trust"],
    isExample: true,
  },
  {
    name: EX("Riverstone Dine"),
    role: "Restaurant",
    quote:
      "Built a conversion-first site with clear menu, events page, and booking links. Added retargeting readiness and tracking.",
    tags: ["Website", "Bookings", "Tracking", "Retargeting"],
    isExample: true,
  },
  {
    name: EX("Corner Cut Salon"),
    role: "Salon",
    quote:
      "Cleaned up profiles, improved highlights, created story templates, and set up a simple booking flow for repeat customers.",
    tags: ["Social setup", "Templates", "Bookings", "Repeat"],
    isExample: true,
  },
  {
    name: EX("Glow Wellness Studio"),
    role: "Wellness and spa",
    quote:
      "Added trust pages, services structure, and a reviews QR flow. Built landing pages for seasonal packages and offers.",
    tags: ["Trust pages", "Offers", "Reviews", "Landing pages"],
    isExample: true,
  },
  {
    name: EX("Neighborhood Kirana Store"),
    role: "Local grocery",
    quote:
      "Created a simple website and e-card that customers can save. Added WhatsApp catalog setup and quick reply flows.",
    tags: ["Website", "E-card", "WhatsApp", "Catalog"],
    isExample: true,
  },
  {
    name: EX("Fresh Mart Bakery"),
    role: "Bakery",
    quote:
      "Built product highlight pages for cakes and custom orders, added inquiry form, and created festival campaign creatives.",
    tags: ["Product pages", "Lead form", "Campaigns", "Festivals"],
    isExample: true,
  },
  {
    name: EX("QuickFix Mobile Repair"),
    role: "Repair shop",
    quote:
      "Created a trust-first page with service list, pricing ranges, and warranty messaging. Added local maps and click-to-call.",
    tags: ["Trust", "Service list", "Maps", "Leads"],
    isExample: true,
  },
  {
    name: EX("Prime Hardware and Paints"),
    role: "Local retail",
    quote:
      "Built a clear catalog-style site with top categories, location pages, and inquiry flow for bulk orders.",
    tags: ["Catalog", "Local pages", "Inquiry", "B2B"],
    isExample: true,
  },
];

// Education and community types (truthful categories, not fake claims)
const COMMUNITY_TYPES = [
  {
    name: "Coaching and tutoring centers",
    role: "Education",
    quote:
      "Admissions-ready pages, course structure, lead forms, and WhatsApp follow-up templates for faster conversions.",
    tags: ["Landing pages", "Leads", "WhatsApp", "Copy"],
  },
  {
    name: "Schools and institutes",
    role: "Education",
    quote:
      "Clear admissions flow, parent-friendly layout, updates section, and location visibility improvements.",
    tags: ["Admissions", "Website", "Local SEO", "Trust"],
  },
  {
    name: "Clinics and local healthcare",
    role: "Services",
    quote:
      "Trust pages, reviews setup, appointment-friendly flow, and professional profile presentation across platforms.",
    tags: ["Trust", "Reviews", "Bookings", "Profiles"],
  },
  {
    name: "Home services",
    role: "Local services",
    quote:
      "Lead-ready website with pricing guidance, WhatsApp booking, and local discovery improvements.",
    tags: ["Leads", "WhatsApp", "Local SEO", "Conversion"],
  },
  {
    name: "Small manufacturers and traders",
    role: "B2B",
    quote:
      "Credible product pages, inquiry forms, and a simple pipeline setup to organize leads and follow-ups.",
    tags: ["Product pages", "CRM", "Leads", "B2B"],
  },
  {
    name: "Creators and personal brands",
    role: "Creator business",
    quote:
      "Offer clarity, landing pages, and consistent templates to keep the brand professional across all touchpoints.",
    tags: ["Messaging", "Templates", "Landing pages", "Brand"],
  },
];

const TESTIMONIALS = [
  {
    name: "Owner, local cafe",
    role: "Monthly partnership",
    quote:
      "Everything started looking consistent. The website, Google profile, and weekly posts made us feel like a real brand.",
  },
  {
    name: "Owner, retail shop",
    role: "Website and e-card",
    quote:
      "Customers can now find us fast and contact us in one tap. The e-card and QR sharing helped a lot.",
  },
  {
    name: "Manager, coaching center",
    role: "Admissions and leads",
    quote:
      "The structure made it easy for parents to understand courses and contact us. Leads became more organized.",
  },
];

function Tags({ tags = [] }) {
  if (!tags.length) return null;
  return (
    <div className="customer-tags">
      {tags.map((t) => (
        <span key={t} className="chip chip-neutral customer-tag">
          {t}
        </span>
      ))}
    </div>
  );
}

function NameRow({ name, isExample }) {
  return (
    <div className="customer-name-row">
      <h3 className="customer-title">{name}</h3>
      {isExample ? (
        <span className="chip chip-neutral customer-example-chip">Example</span>
      ) : null}
    </div>
  );
}

export default function Customers() {
  return (
    <section className="section">
      <div className="container">
        {/* Header */}
        <div className="section-heading section-heading-center">
          <div className="pill pill-soft">Customers</div>
          <h2>Built for local businesses and growing brands.</h2>

          <div className="customer-trustbar">
            <span className="chip chip-neutral">Website and e-card</span>
            <span className="chip chip-neutral">Google profile and local SEO</span>
            <span className="chip chip-neutral">Social setup and content</span>
            <span className="chip chip-neutral">Ads and campaigns</span>
            <span className="chip chip-neutral">Tracking and optimization</span>
          </div>
        </div>

        {/* FEATURED WORK */}
        <div className="section-heading section-heading-center" style={{ marginTop: "2rem" }}>
          <div className="pill pill-soft">Selected work</div>
          <h2>Projects and platforms</h2>
          <p>
            A snapshot of what we have built. Each project is designed to look credible,
            communicate value fast, and convert.
          </p>
        </div>

        <div className="card-grid wipe-group">
          {FEATURED_WORK.map((c) => (
            <article key={c.name} className="showcase-card glass-card wipe-ltr customer-card">
              <div className="customer-card-top">
                <div className="card-label">{c.role}</div>
                <NameRow name={c.name} />
              </div>
              <p className="customer-quote">{c.quote}</p>
              <Tags tags={c.tags} />
            </article>
          ))}
        </div>

        {/* LOCAL EXAMPLES */}
        <div className="section-heading section-heading-center" style={{ marginTop: "3rem" }}>
          <div className="pill pill-soft">Local business examples</div>
          <h2>Yes, we work with small shops too.</h2>
          <p>
            Cafes, breakfast spots, snacks corners, salons, repair shops, and neighborhood stores.
            These are representative examples of the kind of work we do for local businesses.
          </p>
        </div>

        <div className="card-grid wipe-group">
          {LOCAL_EXAMPLES.map((c) => (
            <article key={c.name} className="showcase-card glass-card wipe-ltr customer-card">
              <div className="customer-card-top">
                <div className="card-label">{c.role}</div>
                <NameRow name={c.name} isExample={c.isExample} />
              </div>
              <p className="customer-quote">{c.quote}</p>
              <Tags tags={c.tags} />
            </article>
          ))}
        </div>

        {/* COMMUNITY TYPES */}
        <div className="section-heading section-heading-center" style={{ marginTop: "3rem" }}>
          <div className="pill pill-soft">Who we help</div>
          <h2>Local and mid brands across categories</h2>
          <p>
            The goal stays the same. A strong presence, consistent content, and better conversion.
          </p>
        </div>

        <div className="card-grid wipe-group">
          {COMMUNITY_TYPES.map((c) => (
            <article key={c.name} className="showcase-card glass-card wipe-ltr customer-card">
              <div className="customer-card-top">
                <div className="card-label">{c.role}</div>
                <NameRow name={c.name} />
              </div>
              <p className="customer-quote">{c.quote}</p>
              <Tags tags={c.tags} />
            </article>
          ))}
        </div>

        {/* TESTIMONIALS */}
        <div className="section-heading section-heading-center" style={{ marginTop: "3rem" }}>
          <div className="pill pill-soft">Testimonials</div>
          <h2>What clients usually say</h2>
          <p>Clear communication, fast execution, and a presence that feels trustworthy.</p>
        </div>

        <div className="card-grid wipe-group">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="showcase-card glass-card wipe-ltr customer-card">
              <div className="card-label">{t.role}</div>
              <h3 className="customer-title">{t.name}</h3>
              <p className="customer-quote">{t.quote}</p>
            </article>
          ))}
        </div>

        {/* Trust note */}
        <div className="section-heading section-heading-center" style={{ marginTop: "2rem" }}>
          <p className="customer-note">
            Note: “Example” cards are representative local business scenarios to show the kind of work we do.
            Featured projects are our real builds and platforms.
          </p>
        </div>

        {/* CTA */}
        <div className="hero-card hero-card-main glass-card customer-cta">
          <div>
            <div className="pill pill-soft">Ready to grow</div>
            <h3 style={{ marginTop: "0.6rem" }}>Want a strong online presence for your business?</h3>
            <p style={{ opacity: 0.85, marginTop: "0.4rem" }}>
              We can start with a quick audit and a clear plan, then build what you need.
              Website, e-card, Google profile, social setup, ads, and monthly support.
            </p>
          </div>

          <div className="customer-cta-actions">
            <a className="primary-btn" href="/pricing">
              View pricing
            </a>
            <a className="ghost-btn" href="/contact">
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
