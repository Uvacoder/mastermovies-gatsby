import { Icon } from "antd";
import { Link } from "gatsby";
import React, { FunctionComponent, useEffect, useState } from "react";

import { createCancelToken } from "../../../api/common";
import { getFilms, IGlacierFilmSummary } from "../../../api/glacier";
import { FilmCardResolver } from "../../../components/index/film_card";
import styles from "./glacier.module.css";

export const IndexGlacier: FunctionComponent = () => {

  const [ films, setFilms ] = useState<IGlacierFilmSummary[]>(null);
  const [ filmsError, setFilmsError ] = useState<boolean>(false);

  useEffect(() => {
    const cancelToken = createCancelToken();
    getFilms(cancelToken.token, true)
      .then(setFilms)
      .catch(() => setFilmsError(true));
    return cancelToken.cancel;
  }, [ filmsError ]);

  return (
    <div className={styles.root}>
      <Link to="/glacier" className={styles.heading}>
        <h1 className={styles.title}>Glacier</h1>
        <h5 className={styles.subtitle}>FILM DATABASE</h5>
      </Link>

      <p className={styles.releases}>Newest releases</p>

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
    </div>
  );
};
