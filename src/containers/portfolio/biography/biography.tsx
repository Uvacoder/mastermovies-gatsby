import React from "react";

import { PrettyLink } from "../../../components/common/link";
import { PortfolioDesignElement, PortfolioDesignLeftSlant } from "../../../components/portfolio/design";
import { PortfolioContent, PortfolioSection, PortfolioTitle } from "../../../components/portfolio/section";
import styles from "./biography.module.css";

const BIRTHDAY = {
  DAY: 29,
  MONTH: 6,
  YEAR: 2000,
};

export const PortfolioBiography: React.FC = () => (
  <PortfolioSection>
    <PortfolioDesignElement className={styles.design}>
      <PortfolioDesignLeftSlant className={styles.designSlant} />
    </PortfolioDesignElement>

    <PortfolioContent />

    <PortfolioContent padding>
      <PortfolioTitle>About me</PortfolioTitle>
      <p>
        I'm a <Age />
        -year old student, photographer, filmmaker and IT geek. I was born in the UK before moving to Switzerland at the
        age of 11.
      </p>
      <p>
        Being able to only speak a few words in the local language upon my arrival, the first few years were a struggle
        (ironically, resembling my first years in the UK). During my first year in Switzerland, I wrote a blog which
        helped me to cope by voicing some of my struggles with a touch of humour.
      </p>
      <p>
        Despite this, much to my own disbelief, I somehow managed to stay on top, learning French and currently studying{" "}
        <i>Microengineering</i> at{" "}
        <PrettyLink href="https://epfl.ch" target="_blank">
          École Polytechnique Fédérale de Lausanne
        </PrettyLink>
        , one of Switzerland's two leading technical universities.
      </p>

      <p>
        I'm doing my best, alongside university, to continue developing my programming skills (particular website
        design) and travelling Europe, in the hope of capturing new and unique images, on photo or film.
      </p>
    </PortfolioContent>
  </PortfolioSection>
);

/** A rough Component to display my age, doesn't handle all edge cases */
const Age: React.FC = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // [0-11] !!
  const day = now.getDay();

  const age =
    year - BIRTHDAY.YEAR - (month < BIRTHDAY.MONTH || (month + 1 === BIRTHDAY.MONTH && day < BIRTHDAY.DAY) ? 1 : 0);
  return <span>{age}</span>;
};
