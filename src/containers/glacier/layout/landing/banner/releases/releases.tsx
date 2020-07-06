import { navigate } from "gatsby";
import React from "react";

import { Nothing } from "../../../../../../components/common/nothing";
import { StandardOverlay } from "../../../../../../components/common/standard_overlay";
import { GlacierFilmMeta } from "../../../../../../components/glacier/film_meta";
import { GlacierThumbnail } from "../../../../../../components/glacier/thumbnail";
import { useGlacierFilm } from "../../../../../../hooks/api/glacier";
import { IGlacierSummary } from "../../../../../../types/glacier";
import styles from "./releases.module.css";

interface IGlacierReleasesProps {
  films?: IGlacierSummary[];
}

export const GlacierReleases: React.FC<IGlacierReleasesProps> = ({ films }) => (
  <div className={styles.releases}>
    {Array.isArray(films)
      ? films.map((film, i) => <Release key={i} film={film.id} />)
      : [0, 1, 2].map((v) => <Release key={v} film={void 0} />)}
  </div>
);

const Release: React.FC<{ film?: number }> = ({ film }) => {
  const [resolvedFilm, error, retry] = useGlacierFilm(film);

  return (
    <div
      className={styles.release}
      onClick={resolvedFilm && !error ? () => navigate(`/glacier/film/${resolvedFilm.id}`) : void 0}
    >
      <StandardOverlay
        active={!!error}
        icon={error ? error.icon : void 0}
        text={error ? error.text : void 0}
        code={error ? error.code : void 0}
        button="Retry"
        onButton={retry}
      />
      {resolvedFilm === null ? (
        <Nothing />
      ) : (
        !error && (
          <>
            <GlacierThumbnail
              thumbnails={resolvedFilm ? resolvedFilm.thumbnails : void 0}
              className={styles.thumbnail}
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
        )
      )}
    </div>
  );
};
