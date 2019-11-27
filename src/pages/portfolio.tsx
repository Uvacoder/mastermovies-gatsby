import React, { FunctionComponent } from "react";

import { Footer } from "../components/common/footer";
import { SEO } from "../components/common/seo";
import { PortfolioLayout } from "../components/portfolio/layout";
import { PortfolioBanner } from "../containers/portfolio/banner";
import { PortfolioBiography } from "../containers/portfolio/biography";
import { PortfolioCompany } from "../containers/portfolio/company";
import { PortfolioEnd } from "../containers/portfolio/end";
import { PortfolioFilm } from "../containers/portfolio/film";
import { PortfolioPhotography } from "../containers/portfolio/photography";
import { PortfolioProgramming } from "../containers/portfolio/programming";
import { ThemeContext } from "../hooks/theme";

const Portfolio: FunctionComponent = () => (
  <ThemeContext.Provider value="dark">
    <SEO
      title="Portfolio"
      keywords={["MasterMovies", "portfolio", "personal", "Marcus Cemes"]}
      meta={[
        { name: "theme-color", content: "#000" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      ]}
    />

    <PortfolioLayout>
      <PortfolioBanner />
      <PortfolioBiography />
      <PortfolioCompany />
      <PortfolioProgramming />
      <PortfolioPhotography />
      <PortfolioFilm />
      <PortfolioEnd />
    </PortfolioLayout>

    <Footer />
  </ThemeContext.Provider>
);

export default Portfolio;
