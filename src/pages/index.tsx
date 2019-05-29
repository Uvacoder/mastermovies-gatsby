import { graphql } from "gatsby";
import { FluidObject } from "gatsby-image";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { throttle } from "throttle-debounce";

import { Footer } from "../components/common/footer/footer";
import { Moved } from "../components/common/moved";
import { Nav, ILink } from "../components/common/nav";
import { SEO } from "../components/common/seo";
import { Banner } from "../components/index/banner";
import { IndexGlacier } from "../components/index/glacier";
import { links } from "../config";

interface IndexProps {
  data: {
    background: {
      childImageSharp: {
        sqip: {
          dataURI: string;
        };
        fluid: FluidObject;
      };
    };
    logoImage: {
      publicURL: string;
    };
  };
}

export const query = graphql`
  query {
    background: file(relativePath: { eq: "landing_banner.jpg" }) {
      childImageSharp {
        sqip(mode: 1, numberOfPrimitives: 16, blur: 0) {
          dataURI
        }
        fluid(maxWidth: 1920, quality: 90) {
          ...GatsbyImageSharpFluid_withWebp_noBase64
        }
      }
    }
    logoImage: file(relativePath: { eq: "logo/white.svg" }) {
      publicURL
    }
  }
`;

const Index: FunctionComponent<IndexProps> = ({ data }) => {
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
      const throttled = throttle(200, updateAlternate);

      window.addEventListener("scroll", throttled);

      return () => {
        throttled.cancel();
        window.removeEventListener("scroll", throttled);
      };
    }
  });

  return (
    <>
      <SEO
        title="Home"
        keywords={["MasterMovies", "homepage", "application"]}
      />
      <Moved />
      <Nav
        links={links}
        theme={alternateNav ? "light" : "dark"}
        type="fixed"
        extended={!alternateNav}
        background={alternateNav}
      />
      <Banner
        background={{
          ...data.background.childImageSharp.fluid,
          base64: data.background.childImageSharp.sqip.dataURI,
        }}
        logoURL={data.logoImage.publicURL}
      />
      <div ref={alternateZone}>
        <IndexGlacier />
        <Footer />
      </div>
    </>
  );
};

export default Index;
