import { navigate } from "gatsby";
import React, { FunctionComponent } from "react";

import { IGlacierFilmSummary } from "../../../../../api/glacier";
import { GlacierFilmResolver } from "../../../../../components/glacier/film";
import styles from "./grid.module.css";

interface IGlacierAppGridProps {
  films?: IGlacierFilmSummary[];
}

export const GlacierAppGrid: FunctionComponent<IGlacierAppGridProps> = ({ films = [] }) => {

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
                navigate("/glacier/film/" + clickedFilm, {state:{noScroll: true}});
              }}
            />
          </div>
        ))}
    </div>
  );

}