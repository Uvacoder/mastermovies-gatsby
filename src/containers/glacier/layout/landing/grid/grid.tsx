import { navigate } from "gatsby";
import React from "react";
import { AspectRatio } from "../../../../../components/common/aspect_ratio";
import { Nothing } from "../../../../../components/common/nothing";
import { StandardOverlay } from "../../../../../components/common/standard_overlay";
import { GlacierFilmMeta } from "../../../../../components/glacier/film_meta";
import { GlacierThumbnail } from "../../../../../components/glacier/thumbnail";
import { useGlacierFilm } from "../../../../../hooks/api/glacier";
import { IGlacierSummary } from "../../../../../types/glacier";
import styles from "./grid.module.css";

interface IGlacierGridProps {
  films?: IGlacierSummary[];
}

export const GlacierGrid: React.FC<IGlacierGridProps> = ({ films }) => (
  <div className={styles.grid}>
    {Array.isArray(films)
      ? films.map((film, i) => <GridItem key={i} film={film.id} />)
      : [0, 1, 2].map((v) => <GridItem key={v} />)}
  </div>
);

interface IGridItemProps {
  film?: number;
}

const GridItem: React.FC<IGridItemProps> = ({ film }) => {
  const [resolvedFilm, error, retry] = useGlacierFilm(film);

  const openFilm = (film: number) => {
    navigate(`/glacier/film/${film}`);
  };

  return (
    <div className={styles.film} onClick={resolvedFilm && !error ? () => openFilm(resolvedFilm.id) : void 0}>
      {resolvedFilm === null ? (
        <Nothing />
      ) : error ? (
        <AspectRatio ratio={2}>
          <StandardOverlay
            active
            text={error.text}
            code={error.code}
            icon={error.icon}
            button="Retry"
            onButton={retry}
          />
        </AspectRatio>
      ) : (
        <>
          <AspectRatio ratio={1.77}>
            <GlacierThumbnail thumbnails={resolvedFilm && resolvedFilm.thumbnails} borderRadius={3} fill cover />
          </AspectRatio>
          <GlacierFilmMeta
            name={resolvedFilm && resolvedFilm.name}
            release={resolvedFilm && resolvedFilm.release}
            description={resolvedFilm && resolvedFilm.description}
          />
        </>
      )}
    </div>
  );
};
