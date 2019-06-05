import React, { FunctionComponent } from "react";

import { IGlacierFilmSummary } from "../../../../../api/glacier";
import { GlacierFilmResolver } from "../../../../../components/glacier/film";
import styles from "./grid.module.css";

interface IGlacierAppGridProps {
  films?: IGlacierFilmSummary[];
  navigate: (url: string) => any;
}

export const GlacierAppGrid: FunctionComponent<IGlacierAppGridProps> = ({ films = [], navigate }) => {

  return (
    <div className={styles.grid}>
      {films.map(
        film => (
          <div
            key={film.fingerprint}
            className={styles.filmWrapper}
          >
            <GlacierFilmResolver
              film={film.fingerprint}
              onOpen={(clickedFilm) => {
                navigate("/glacier/film/" + clickedFilm);
              }}
            />
          </div>
        ))}
    </div>
  );

}