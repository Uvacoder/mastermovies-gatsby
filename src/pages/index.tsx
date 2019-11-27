import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { throttle } from "throttle-debounce";

import { Footer } from "../components/common/footer/footer";
import { Nav } from "../components/common/nav";
import { SEO } from "../components/common/seo";
import { NAV_LINKS } from "../config";
import { IndexBanner } from "../containers/index/banner";
import { IndexGlacier } from "../containers/index/glacier";
import { IndexPortfolio } from "../containers/index/portfolio";
import { ThemeContext } from "../hooks/theme";

const Index: FunctionComponent = () => {
  const [alternateSidebar, setAlternateSidebar] = useState(false);
  const [alternateNav, setAlternateNav] = useState(false);
  const alternateZone = useRef(null);

  // Calculate whether the alternate sidebar should be visible
  const updateAlternate = (): boolean => {
    const top = alternateZone.current.getBoundingClientRect().top;
    const shouldAlternateSidebar = top < 96;
    const shouldAlternateNav = top < 64;
    let changes = false;
    if (alternateSidebar !== shouldAlternateSidebar) {
      setAlternateSidebar(shouldAlternateSidebar);
      changes = true;
    }
    if (alternateNav !== shouldAlternateNav) {
      setAlternateNav(shouldAlternateNav);
      changes = true;
    }
    return changes;
  };

  // Trigger state update when scrolling, every 200ms
  useEffect(() => {
    if (typeof window !== "undefined") {
      const throttled = throttle(100, updateAlternate);

      window.addEventListener("scroll", throttled);

      return () => {
        throttled.cancel();
        window.removeEventListener("scroll", throttled);
      };
    }
  });

  return (
    <>
      <SEO title="Home" keywords={["MasterMovies", "homepage", "application"]} />

      <ThemeContext.Provider value={alternateNav ? "light" : "dark"}>
        <Nav links={NAV_LINKS} type="fixed" extended={!alternateNav} background={!!alternateNav} />
      </ThemeContext.Provider>

      <IndexBanner />
      <div ref={alternateZone}>
        <IndexGlacier />
        <IndexPortfolio />
        <Footer />
      </div>
    </>
  );
};

export default Index;
