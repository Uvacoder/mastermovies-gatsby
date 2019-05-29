import { RouteComponentProps } from "@reach/router";
import { message } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";

import { links } from "../../../config";
import { createCancelToken } from "../../common/api/common";
import { getFilms, IGlacierFilmSummary } from "../../common/api/glacier";
import { FilmCardResolver } from "../../common/film_card/film_card_resolver";
import { Footer } from "../../common/footer/footer";
import { Nav } from "../../common/nav";
import { GlacierError } from "./error";
import styles from "./landing.module.css";

export const GlacierLanding: FunctionComponent<RouteComponentProps> = () => {
  const [error, setError] = useState(false);
  const [films, setFilms] = useState<IGlacierFilmSummary[]>(
    [].fill(null, 0, 6)
  );

  useEffect(() => {
    if (!error) {
      const cancelToken = createCancelToken();

      getFilms(cancelToken.token, false)
        .then(setFilms)
        .catch(() => {
          setError(true);
          message.error("An error occurred while connecting to Glacier", 5);
        });

      return cancelToken.cancel;
    }
  }, [error]);

  const glacierLogo = <span className={styles.logo}>Glacier</span>;

  return (
    <div className={styles.root}>
      <Nav
        extended
        links={links}
        logo={{ text: glacierLogo, link: "https://mastermovies.uk/glacier" }}
        theme="dark"
      />

      <div className={styles.list}>
        {films.map(film => (
          <FilmCardResolver
            key={film.fingerprint}
            film={film.fingerprint}
            theme="dark"
            className={styles.card}
          />
        ))}
      </div>

      {error && <GlacierError onRetry={() => setError(false)} />}

      <Footer theme="dark" />
    </div>
  );
};
