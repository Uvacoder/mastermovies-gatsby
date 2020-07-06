import React from "react";

import { navigate } from "gatsby";
import { animated, useTransition } from "react-spring";
import { StandardOverlay } from "../../../../../components/common/standard_overlay";
import { GlacierFilmMeta } from "../../../../../components/glacier/film_meta";
import { GlacierThumbnail } from "../../../../../components/glacier/thumbnail";
import { useGlacierFilm } from "../../../../../hooks/api/glacier";
import { IGlacierSummary } from "../../../../../types/glacier";
import styles from "./results.module.css";

interface IGlacierResultsProps {
  results: IGlacierSummary[];
}

const HEIGHT = 250;

export const GlacierResults: React.FC<IGlacierResultsProps> = ({ results }) => {
  // @ts-ignore
  const transitions = useTransition(
    results.map((result, i) => ({ ...result, i })),
    (item) => item.id,
    {
      // @ts-ignore
      from: { y: 0, opacity: 0 },
      // @ts-ignore
      enter: ({ i }) => ({ y: HEIGHT * i, opacity: 1 }),
      // @ts-ignore
      leave: { opacity: 0 },
      // @ts-ignore
      update: ({ i }) => ({ y: HEIGHT * i }),
    }
  );

  return (
    <div className={styles.result} style={{ height: results.length * HEIGHT }}>
      {/* @ts-ignore Bad library typings */}
      {transitions.map(({ item, props: { y, ...rest }, key }) => (
        <animated.div
          key={key}
          style={{
            ...rest,
            zIndex: results.length - item.i,
            transform: y.interpolate((v) => `translate3d(0,${v}px,0)`),
          }}
        >
          <ResultItem key={item.id} film={item.id} />
        </animated.div>
      ))}
    </div>
  );
};

interface IGlacierListItemProps {
  film?: number;
}

const ResultItem: React.FC<IGlacierListItemProps> = ({ film }) => {
  const [resolvedFilm, error, retry] = useGlacierFilm(film);

  return (
    <div
      className={styles.resultItem}
      onClick={resolvedFilm && !error ? () => navigate(`/glacier/film/${resolvedFilm.id}`) : void 0}
    >
      {error ? (
        <StandardOverlay active text={error.text} code={error.text} icon={error.icon} button="Retry" onButton={retry} />
      ) : (
        <>
          <GlacierThumbnail
            className={styles.thumbnail}
            thumbnails={resolvedFilm ? resolvedFilm.thumbnails : void 0}
            borderRadius={3}
            noAspectRatio
            cover
          />
          <div className={styles.meta}>
            <GlacierFilmMeta
              name={resolvedFilm && resolvedFilm.name}
              release={resolvedFilm && resolvedFilm.release}
              description={resolvedFilm && resolvedFilm.description}
            />
          </div>
        </>
      )}
    </div>
  );
};
