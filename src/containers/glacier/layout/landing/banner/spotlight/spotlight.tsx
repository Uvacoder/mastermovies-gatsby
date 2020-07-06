import { navigate } from "gatsby";
import React from "react";

import { Nothing } from "../../../../../../components/common/nothing";
import { StandardOverlay } from "../../../../../../components/common/standard_overlay";
import { GlacierFilmDescription, GlacierFilmTitle } from "../../../../../../components/glacier/film_meta";
import { GlacierThumbnail } from "../../../../../../components/glacier/thumbnail";
import { useGlacierFilm } from "../../../../../../hooks/api/glacier";
import { IGlacierSummary } from "../../../../../../types/glacier";
import styles from "./spotlight.module.css";

interface IGlacierSpotlightProps {
  film?: IGlacierSummary;
}

export const GlacierSpotlight: React.FC<IGlacierSpotlightProps> = ({ film }) => {
  const [resolvedFilm, error, retry] = useGlacierFilm(film ? film.id : void 0);

  return (
    <div className={styles.spotlightContainer}>
      <div
        className={styles.spotlight}
        onClick={resolvedFilm && !error ? () => navigate(`/glacier/film/${resolvedFilm.id}`) : void 0}
      >
        {film === null || resolvedFilm === null ? (
          <Nothing />
        ) : error ? (
          <StandardOverlay
            active
            icon={error.icon}
            text={error.text}
            code={error.code}
            button="Retry"
            onButton={retry}
          />
        ) : (
          <>
            <GlacierThumbnail
              thumbnails={resolvedFilm ? resolvedFilm.thumbnails : void 0}
              className={styles.thumbnail}
              borderRadius={3}
              noAspectRatio
              cover
            />
            <div className={styles.meta}>
              <GlacierFilmTitle
                className={styles.title}
                name={resolvedFilm && resolvedFilm.name}
                release={resolvedFilm && resolvedFilm.release}
              />
              <GlacierFilmDescription
                className={styles.description}
                description={resolvedFilm && resolvedFilm.description}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
