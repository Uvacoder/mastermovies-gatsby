import { navigate } from "gatsby";
import React from "react";

import { StandardOverlay } from "../../../../../components/common/standard_overlay";
import { GlacierFilmMeta } from "../../../../../components/glacier/film_meta";
import { GlacierThumbnail } from "../../../../../components/glacier/thumbnail";
import { useGlacierFilm } from "../../../../../hooks/api/glacier";
import { IGlacierSummary } from "../../../../../types/glacier";
import styles from "./list.module.css";

interface IGlacierListProps {
  films: IGlacierSummary[];
}

export const GlacierList: React.FC<IGlacierListProps> = ({ films }) => {
  const filmItems = films
    ? films.map((film) => <GlacierListItem key={film.id} film={film.id} />)
    : [0, 1, 2, 3, 4, 5].map((i) => <GlacierListItem key={i} film={void 0} />);

  return <div className={styles.list}>{filmItems};</div>;
};

interface IGlacierListItemProps {
  film?: number;
}

const GlacierListItem: React.FC<IGlacierListItemProps> = ({ film }) => {
  const [resolvedFilm, error, retry] = useGlacierFilm(film);

  return (
    <div
      className={styles.listItem}
      onClick={resolvedFilm && !error ? () => navigate(`/glacier/film/${resolvedFilm.id}`) : void 0}
    >
      {error ? (
        <StandardOverlay active text={error.text} code={error.code} icon={error.icon} button="Retry" onButton={retry} />
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
