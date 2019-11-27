import { Icon } from "antd";
import Tooltip from "antd/lib/tooltip";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { GlacierLogo } from "../../../components/common/logos";
import { Spinner } from "../../../components/common/spinner";
import { GlacierFilmMeta } from "../../../components/glacier/film_meta";
import { FilmPlayer } from "../../../components/glacier/film_player";
import { PortfolioButton } from "../../../components/portfolio/button";
import { PortfolioContent, PortfolioSection, PortfolioTitle } from "../../../components/portfolio/section";
import { useGlacierFilm } from "../../../hooks/api/glacier";
import { useGlacierAuth } from "../../../hooks/api/glacier_auth";
import { QuoteIcon } from "../../../images/icons/quote";
import styles from "./film.module.css";

export const PortfolioFilm: FunctionComponent = () => (
  <>
    <PortfolioSection>
      <PortfolioContent vertical padding>
        <PortfolioTitle>Filmmaking</PortfolioTitle>
        <p>
          My very first film was a short experiment that I made with a friend using the original{" "}
          <i>Windows Movie Maker</i> (also around the age of 8). It was the first <i>MasterMovies</i>-branded
          production. Since then I've experimented with a variety of different video software, such as{" "}
          <i>Sony Vegas Pro</i>, <i>Final Cut Pro X</i>, <i>Davinci Resolve</i> and <i>Adobe Premiere Pro</i> (which is
          currently my go-to solution) across a wide range of personal, professional and educational projects.
        </p>
        <p>
          Filmmaking is one of my greatest passions, I often find myself admiring the visual quality of an advertisement
          or short video while remaining oblivious to the content or product. In my opinion, video is a delicately
          complex fusion of a great many factors, ranging from sound integration to colour science, that must work in
          perfect harmony to deliver a great result, and if done correctly, has an unrivalled reach in today's society.
        </p>
        <p>
          Despite this, and much to my disappointment, making films is extremely time-consuming, and therefore remains a
          secondary hobby alongside my studies.
        </p>

        <div className={styles.buttons}>
          <PortfolioButton href="/glacier">
            <GlacierLogo />
            &nbsp;database
          </PortfolioButton>

          <PortfolioButton
            href="https://www.youtube.com/channel/UCRx9M5nYJfW9F5hsFcklwKQ"
            icon={<Icon type="youtube" />}
          >
            My channel
          </PortfolioButton>
        </div>
      </PortfolioContent>

      <PortfolioContent padding>
        <Film />
      </PortfolioContent>
    </PortfolioSection>

    <PortfolioSection separate>
      <PortfolioContent padding>
        <Statistics />
      </PortfolioContent>
      <PortfolioContent padding>
        <Quote />
      </PortfolioContent>
    </PortfolioSection>
  </>
);

const FILMS_PRODUCED = 17;
const VIDEOS_PRODUCED = 45;

const Statistics: FunctionComponent = () => (
  <div className={styles.statistics}>
    <h2 className={styles.statisticsTitle}>To date, I have invested myself in</h2>
    <div className={styles.statisticsRow}>
      <StatisticsItem
        text="Glacier releases"
        number={FILMS_PRODUCED}
        tooltip="These are films that I am proud to recognise as my works"
      />
      <StatisticsItem
        text="Other videos"
        number={VIDEOS_PRODUCED}
        tooltip="A combination of experimental montages, smaller works and game-based content"
      />
    </div>
  </div>
);

const StatisticsItem: FunctionComponent<{ text: string; number: number; tooltip: string }> = ({
  text,
  number,
  tooltip,
}) => {
  const [ref, inView] = useInView({ triggerOnce: true });
  const [startCounting, setStartCounting] = useState<boolean>(false);

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => setStartCounting(true), 1000);
      return () => clearTimeout(timeout);
    }
  }, [inView]);

  return (
    <Tooltip title={tooltip} placement="bottom">
      <div ref={ref} className={styles.statisticsFigure}>
        <span
          children={
            <>
              <AnimatedFigure target={startCounting ? number : 0} /> +
            </>
          }
          className={styles.statisticsItemCount}
        />
        <h3 children={text} className={styles.statisticsItemTitle} />
      </div>
    </Tooltip>
  );
};

const AnimatedFigure: FunctionComponent<{ target: number }> = ({ target }) => {
  const [current, setCurrent] = useState<number>(0);
  const duration = target * 50;

  useEffect(() => {
    let start: number;
    let animationFrame: number | null = null;

    const callback: FrameRequestCallback = time => {
      animationFrame = null;

      if (typeof start === "undefined") {
        start = time;
      }

      const progress = (time - start) / duration;
      if (progress >= 1) {
        setCurrent(target);
        return;
      }

      setCurrent(Math.round(target * cubicOut(progress)));
      animationFrame = requestAnimationFrame(callback);
    };

    animationFrame = requestAnimationFrame(callback);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [target]);

  return <span children={current.toString()} />;
};

function cubicOut(t: number) {
  const t2 = t - 1;
  return t2 * t2 * t2 + 1;
}

const Quote: FunctionComponent = () => (
  <div className={styles.quote}>
    <QuoteIcon className={styles.quoteIcon} />
    <div className={styles.quoteText}>
      <p>Cinema is a mirror by which we often see ourselves.</p>
      <p className={styles.quoteSignature}> — Alejandro Gonzalez Inarritu</p>
    </div>
  </div>
);

const BRAMMER_WEDDING = 15;

const Film = () => {
  const [film, error] = useGlacierFilm(BRAMMER_WEDDING);
  const [, auth] = useGlacierAuth(BRAMMER_WEDDING);

  return !!error ? (
    <i className={styles.glacierError}>Glacier is currently unavailable</i>
  ) : film !== null && auth ? (
    <>
      <FilmPlayer
        className={styles.player}
        exps={film.exports}
        thumbnails={film.thumbnails}
        authorisation={auth}
        initial="worst"
      />
      <GlacierFilmMeta name={film.name} release={film.release} description={film.description} />
    </>
  ) : (
    <Spinner active />
  );
};
