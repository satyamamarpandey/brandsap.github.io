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
    const el = stickyRef.current;
    if (!el) return;

    const root = document.documentElement;
    const styles = getComputedStyle(root);

    const navH = parseFloat(styles.getPropertyValue("--navH")) || 72;
    const topbarH = parseFloat(styles.getPropertyValue("--topbarH")) || 0;

    const y = el.getBoundingClientRect().top + window.pageYOffset;
    const offset = navH + topbarH + 16;

    window.scrollTo({ top: y - offset, behavior: "smooth" });
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
<div ref={stickyRef} className="section sticky-split-anchor">
  <StickySplitFeatures />
</div>

    </LayoutGroup>
  );
}
