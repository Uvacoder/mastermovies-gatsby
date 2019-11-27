import React, { FunctionComponent } from "react";

import { MasterMoviesLogo } from "../../../components/common/logos";
import { PortfolioContent, PortfolioSection, PortfolioTitle } from "../../../components/portfolio/section";

export const PortfolioCompany: FunctionComponent = () => (
  <PortfolioSection separate>
    <PortfolioContent padding>
      <PortfolioTitle>What is MasterMovies?</PortfolioTitle>
      <p>
        I came up with the name <MasterMoviesLogo /> when I was eight years old, as I was starting to experiment with my
        first video productions. I used the name as a means to make my work sound more official, buying the{" "}
        <i>mastermovies.co.uk</i> domain to complete the corporate image.
      </p>

      <p>
        My first few "films" were published under the name <i>MasterMovies Productions</i>, with several variants such
        as <i>MasterMovies Ultimate</i> and <i>MasterMovies Films</i> popping up. Today, I continue to use{" "}
        <MasterMoviesLogo /> as my publishing name, although the website serves more as my portfolio (and a playground
        for me to play around with geeky stuff!).
      </p>
    </PortfolioContent>

    <PortfolioContent></PortfolioContent>
  </PortfolioSection>
);
