import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import React, { FunctionComponent, useEffect, useState } from "react";

import { createCancelToken } from "../../../../api/common";
import { getFilms, IGlacierFilmSummary } from "../../../../api/glacier";
import { Footer } from "../../../../components/common/footer";
import { Nav } from "../../../../components/common/nav";
import { StandardOverlay } from "../../../../components/common/standard_overlay";
import { GlacierLogo } from "../../../../components/glacier/glacier_logo";
import { links } from "../../../../config";
import { GlacierIntro } from "../intro";
import { GlacierActions } from "./actions";
import { GlacierDownload } from "./download";
import { GlacierAppGrid } from "./grid";
import styles from "./main.module.css";
import { GlacierSearch } from "./search";


export const GlacierMain: FunctionComponent<RouteComponentProps<{ film: string }>> = ({ film }) => {

  const [ introFinished, setIntroFinished ] = useState<boolean>(false);

  // Resolve films from the API
  const [ resolve, setResolve ] = useState<boolean>(true);
  const [ resolvedFilms, setResolvedFilms ] = useState<IGlacierFilmSummary[]>([]);
  const [ resolveError, setResolveError ] = useState(null);

  // For searching/filtering
  const [ displayedFilms, setDisplayedFilms ] = useState<IGlacierFilmSummary[]>([]);
  const [ numberSearchResults, setNumberSearchResults ] = useState<number>(null);

  useEffect(() => {
    if (resolve) {
      let mounted = true;
      const cancelToken = createCancelToken();

      getFilms(cancelToken.token, false)
        .then(films => {
          if (mounted) {
            setResolvedFilms(films);
            setDisplayedFilms(films);
            setResolve(false);
          }
        })
        .catch(() => {
          if (mounted) {
            setResolveError(true);
            setResolve(false);
          }
        });

        return () => { mounted = false; cancelToken.cancel(); };
    }
  }, [ resolve ]);

  /** Compare title, year removing accents and ignoring case */
  const handleSearch = (value: string) => {
    const v = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!value) {
      setDisplayedFilms(resolvedFilms);
      setNumberSearchResults(null);
      return;
    }

    const matched = [];
    for (const film of resolvedFilms) {
      if (
        film.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(v) !== -1
        || new Date(film.release).getUTCFullYear().toString().indexOf(v) !== -1) {
        matched.push(film);
      }
    }

    setDisplayedFilms(matched);
    setNumberSearchResults(matched.length);
  }

  return (
    <>
      <GlacierIntro onComplete={() => setIntroFinished(true)} />
      <div className={styles.browser}>
        <Nav extended type="static" theme="dark" links={links} logo={{text: <GlacierLogo theme="dark" />, link: "https://mastermovies.uk/glacier"}} />

        <StandardOverlay
            theme="dark"
            active={resolve || !!resolveError}
            text={resolveError? "Failed to connect to Glacier" : "Connecting to Glacier..."}
            icon={resolveError? "api" : "cloud-upload"}
            button={resolveError && "Retry"}
            onButton={resolveError && (() => { setResolveError(null); setResolve(true); })}
            shimmer={resolve}
          />

        {resolvedFilms.length > 0 && (
          <>
            <div className={styles.actionBar}>
              <div className={styles.actionPadding} />

              <div className={styles.actionSearch}>
                <GlacierSearch onSearch={handleSearch} showClear={numberSearchResults !== null} />
                {numberSearchResults !== null && <span className={styles.searchResults}>Found {numberSearchResults} films</span>}
              </div>

              <div className={styles.actionButtons}>
                <GlacierActions />
              </div>
            </div>

            <div className={styles.content}>
              <GlacierAppGrid films={introFinished? displayedFilms : []} />
            </div>

            <div>
              <GlacierDownload film={film} onBack={() => navigate("/glacier", {state: { noScroll: true }})} />
            </div>

            <Footer theme="dark" />
          </>
        )}


      </div>
    </>
  );

}