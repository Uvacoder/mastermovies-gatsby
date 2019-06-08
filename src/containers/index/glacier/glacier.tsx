import { Icon } from "antd";
import { Link } from "gatsby";
import React, { FunctionComponent, useEffect, useState } from "react";

import { createCancelToken } from "../../../api/common";
import { getFilms, IGlacierFilmSummary } from "../../../api/glacier";
import { FilmCardResolver } from "../../../components/index/film_card";
import styles from "./glacier.module.css";

interface IOverlayError {
  text: string;
  code?: string;
}


export const IndexGlacier: FunctionComponent = () => {

  const [ films, setFilms ] = useState<IGlacierFilmSummary[]>(null);
  const [ filmsError, setFilmsError ] = useState<IOverlayError>(null);

  useEffect(() => {
    if (!filmsError) {
      let mounted = true;
      const cancelToken = createCancelToken();
      getFilms(cancelToken.token, true)
        .then(films => {
          if (mounted) setFilms(films);
        })
        .catch(err => {
          if (mounted) {
            if (err && err.response && err.response.status === 429) {
              setFilmsError({ text: "Failed to connect to Glacier", code: `Error: 429 Too Many Requests`});
            } else {
              setFilmsError({ text: "Failed to connect to Glacier", code: err.message? `Error: ${err.message}` : "Unknown error"});
            }
          }
        });

      return () => {
        mounted = false;
        cancelToken.cancel();
      }
    }
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
          error={filmsError? filmsError : void 0}
          onRetry={() => setFilmsError(null)}
          className={styles.card}
        />

        <Icon type="minus" className={styles.divider} />

        <FilmCardResolver
          film={films && films[1] ? films[1].fingerprint : null}
          error={filmsError? filmsError : void 0}
          onRetry={() => setFilmsError(null)}
          className={styles.card}
        />
      </div>
    </div>
  );
};
