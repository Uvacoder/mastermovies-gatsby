import { Link } from "gatsby";
import React, { FunctionComponent } from "react";

import { FilmCardResolver } from "../../../components/index/film_card";
import { useGlacierFilms } from "../../../hooks/api/glacier";
import styles from "./glacier.module.css";

/** Provides a Glacier preview on the homepage */
export const IndexGlacier: FunctionComponent = () => {
  const [films, error, retry] = useGlacierFilms({ public: true, order_by: "desc", sort_by: "release" });

  // undefined shows loading, null shows "No Data"
  const leftFilm = films ? (films[0] ? films[0].id : null) : void 0;
  const rightFilm = films ? (films[1] ? films[1].id : null) : void 0;

  return (
    <div className={styles.root}>
      <Link to="/glacier" className={styles.heading}>
        <h1 className={styles.title}>Glacier</h1>
        <h5 className={styles.subtitle}>FILM DATABASE</h5>
      </Link>

      <p className={styles.releases}>Newest releases</p>

      <div className={styles.filmsContainer}>
        <FilmCardResolver film={leftFilm} error={error} onRetry={retry} className={styles.card} />

        <div className={styles.divider} />

        <FilmCardResolver film={rightFilm} error={error} onRetry={retry} className={styles.card} />
      </div>
    </div>
  );
};
