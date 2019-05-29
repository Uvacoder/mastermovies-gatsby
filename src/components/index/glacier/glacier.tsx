import { Icon } from "antd";
import { Link } from "gatsby";
import React, { FunctionComponent, useEffect, useState } from "react";

import { createCancelToken } from "../../common/api/common";
import { getFilms, IGlacierFilmSummary } from "../../common/api/glacier";
import { FilmCardResolver } from "../../common/film_card/film_card_resolver";
import styles from "./glacier.module.css";

export const IndexGlacier: FunctionComponent = () => {
  const [films, setFilms] = useState<IGlacierFilmSummary[]>(null);
  const [filmsError, setFilmsError] = useState<boolean>(false);

  useEffect(() => {
    const cancelToken = createCancelToken();
    getFilms(cancelToken.token, true)
      .then(setFilms)
      .catch(() => setFilmsError(true));
    return cancelToken.cancel;
  }, [filmsError]);

  return (
    <div className={styles.root}>
      <Link to="/glacier" className={styles.heading}>
        <h1 className={styles.title}>Glacier</h1>
        <h5 className={styles.subtitle}>FILM DATABASE</h5>
      </Link>

      <p className={styles.releases}>New releases</p>

      <div className={styles.filmsContainer}>
        <FilmCardResolver
          film={films && films[0] ? films[0].fingerprint : null}
          error={filmsError}
          onRetry={() => setFilmsError(false)}
        />
        <Icon type="minus" style={{ margin: "16px", color: "#AAA" }} />
        <FilmCardResolver
          film={films && films[1] ? films[1].fingerprint : null}
          error={filmsError}
          onRetry={() => setFilmsError(false)}
        />
      </div>

      <Link to="/glacier">
        <div className={styles.link}>
          <span style={{ marginLeft: "1rem" }}>VISIT</span>
          <Icon type="right" style={{ marginLeft: "1rem" }} />
        </div>
      </Link>
    </div>
  );
};
