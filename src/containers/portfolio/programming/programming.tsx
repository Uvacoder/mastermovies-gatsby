import { GithubOutlined } from "@ant-design/icons";
import classnames from "classnames";
import React from "react";
import { InView } from "react-intersection-observer";
import { PrettyLink } from "../../../components/common/link";
import { PortfolioButton } from "../../../components/portfolio/button";
import { PortfolioDesignElement, PortfolioDesignRightSlant } from "../../../components/portfolio/design";
import { PortfolioContent, PortfolioSection, PortfolioTitle } from "../../../components/portfolio/section";
import { CodeExample } from "./code_example";
import styles from "./programming.module.css";

const LEGEND_TITLES = ["Barely tried", "Pretty confident", "This is my jam"];

const LANGUAGES: { [index: string]: number } = {
  "Javascript / Typescript": 1,
  "HTML / CSS": 0.9,
  SQL: 0.6,
  Python: 0.39,
  "C++": 0.25,
  Dart: 0.15,
  Java: 0.1,
  Rust: 0.05,
  "C#": 0.025,
  Lua: 0.02,
};

export const PortfolioProgramming: React.FC = () => (
  <>
    <PortfolioSection separate>
      <PortfolioDesignElement className={styles.design}>
        <PortfolioDesignRightSlant />
      </PortfolioDesignElement>

      <PortfolioContent horizontal vertical>
        <CodeExample />
        <div className={styles.caption}>My very first C++ program</div>
      </PortfolioContent>

      <PortfolioContent padding vertical>
        <PortfolioTitle>Programming</PortfolioTitle>
        <p>
          I've been programming since the age of eight, when I wrote my first line of code in <i>Lua</i> to interact
          with a virtual game world. I continued to dissect existing scripts, before slowly getting more involved with
          web design (and web-related programming) to accompany the old <i>mastermovies.co.uk</i> website.
        </p>
        <p>
          Today I'm studying C++, courtesy of university, while continuing to experiment with other languages in my own
          projects.
        </p>
        <div className={styles.buttons}>
          <PortfolioButton icon={<GithubOutlined />} href="https://github.com/MarcusCemes">
            My GitHub
          </PortfolioButton>
        </div>
      </PortfolioContent>
    </PortfolioSection>

    <PortfolioSection separate>
      <PortfolioContent padding vertical>
        <PortfolioTitle>My IT experience</PortfolioTitle>
        <p>
          The truth is that there is no <i>one size fits all</i> solution in IT. Everything has its merits and its
          flaws. The best option is the one that the developer/engineer is most familiar with and can manipulate with
          ease to achieve the end result, a delicate balance to do the best you can with what you have at your disposal,
          while reducing the flaws as much as possible.
        </p>
        <p>
          Over the years I've accumulated a wide variety of programming and general IT hardware and software knowledge.
          My personal projects, such as this website, have provided me with opportunities to create real-world
          applications using everything from Python to PHP, Postfix to Postgres and Powerpoint to Premiere Pro (there
          are a lot of things that start with <i>P</i>!).
        </p>
        <p>
          I'm most comfortable in the web development world, overcomplicating simple ideas like a simple{" "}
          <PrettyLink href="/glacier">film streaming page</PrettyLink> into a React+NodeJS+Postgres delivery system,
          rate-limited, using a RESTful-based API, JWT authentication, ... Web development a beautifully visual and
          rewarding experience, very easy to get into (but extremely difficult to perfect).
        </p>
      </PortfolioContent>

      <PortfolioContent>
        <InView triggerOnce>
          {({ inView, ref }) => (
            <div ref={ref} className={styles.table}>
              {Object.entries(LANGUAGES).map(([lang, understanding], i) => (
                <Language key={lang} active={inView} delay={300 + i * 100} lang={lang} understanding={understanding} />
              ))}
              <Legend key="legend" />
            </div>
          )}
        </InView>
        <div className={styles.tableComment}>
          These are very rough estimations. I just wanted to put a chart somewhere.
        </div>
      </PortfolioContent>
    </PortfolioSection>
  </>
);

const Legend: React.FC = () => {
  const titles = [];

  for (let i = 0; i < LEGEND_TITLES.length; i++) {
    titles.push(
      <div
        key={LEGEND_TITLES[i]}
        className={classnames(styles.legendItem, {
          [styles.isFirst]: i === 0,
          [styles.isLast]: i === LEGEND_TITLES.length - 1,
        })}
        children={LEGEND_TITLES[i]}
      />,
      <div key={`${i}-seperator`} className={styles.legendSeparator} />
    );
  }

  titles.pop();

  return (
    <div key="legend" className={styles.legend}>
      {titles}
    </div>
  );
};

const Language: React.FC<{ active: boolean; delay: number; lang: string; understanding: number }> = ({
  active,
  delay,
  lang,
  understanding,
}) => {
  const width = active ? `${Math.round(understanding * 100)}%` : `0%`;
  const inverseWidth = active ? `${Math.round(100 / understanding)}%` : `100%`;

  return (
    <div>
      <div className={styles.lang}>{lang}</div>
      <div className={styles.understanding}>
        <div className={styles.barWrapper} style={{ width, transitionDelay: `${delay}ms` }}>
          <div className={styles.bar} style={{ width: inverseWidth, transitionDelay: `${delay}ms` }} />
        </div>

        <div className={styles.barShadow} style={{ width, transitionDelay: `${delay}ms` }}>
          <div className={styles.bar} style={{ width: inverseWidth, transitionDelay: `${delay}ms` }} />
        </div>
      </div>
    </div>
  );
};
