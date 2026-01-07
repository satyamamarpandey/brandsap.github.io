// src/pages/Home.jsx
import { useEffect, useRef, useState } from "react";
import { LayoutGroup } from "framer-motion";

import Hero from "../components/Hero.jsx";
import ShowcaseSection from "../components/ShowcaseSection.jsx";
import StickySplitFeatures from "../components/StickySplitFeatures.jsx";

export default function Home() {
  const [activeId, setActiveId] = useState(null);
  const stickyRef = useRef(null);

  useEffect(() => {
    if (!activeId) return;
    const t = setTimeout(() => {
      stickyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(t);
  }, [activeId]);

  return (
    <LayoutGroup id="home-cards">
      <section className="section hero-section">
        <Hero />
      </section>

      <section className="section">
        <ShowcaseSection activeId={activeId} onSelect={setActiveId} />
      </section>

      {/* No extra section padding here */}
      <div ref={stickyRef}>
        <StickySplitFeatures />
      </div>
    </LayoutGroup>
  );
}
