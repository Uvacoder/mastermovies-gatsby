import { navigate } from "gatsby";
import React, { FunctionComponent, useEffect, useState, ReactNode } from "react";

import { createCancelToken } from "../../../api/common";
import { getFilm, IGlacierFilm } from "../../../api/glacier";
import { StandardOverlay } from "../../common/standard_overlay";
import { FilmCard } from "./film_card";

type divProps = JSX.IntrinsicElements["div"];
interface IFilmCardResolverProps extends divProps {
  /** The fingerprint of the film */
  film?: string;
  error?: IOverlayError;
  onRetry?: () => any;
}

interface IOverlayError {
  text: ReactNode;
  icon?: string;
  code?: string;
}

/**
 * A smart component that will attempt to resolve a film from it's fingerprint, while passing
 * down all original props, such as error and retry. If an internal error occurs, the error
 * props will be overwritten to reflect the internal retry functions.
 */
export const FilmCardResolver: FunctionComponent<IFilmCardResolverProps> = ({ film = "", onClick, error, onRetry, ...rest }) => {

  const [ resolvedFilm, setResolvedFilm ] = useState<IGlacierFilm>(null);
  const [ resolveError, setResolveError ] = useState<IOverlayError>(null);

  // Handle prop errors
  useEffect(() => {
    if (error) {
      setResolveError(error);
    } else {
      setResolveError(null);
    }
  }, [ error ])

  useEffect(() => {
    if (!error && !resolveError && film) {
      let mounted = true;
      const cancelToken = createCancelToken();

      getFilm(cancelToken.token, film)
        .then(film => {
          if (mounted) {
            setResolvedFilm(film);
          }
        })
        .catch(err => {
          if (mounted) {
            let errorSet = false;
            if (err && err.response) {

              if (err.response.status === 429) {
                setResolveError({ text: "Try again in a few minutes", code: "Error: 429 Too Many Requests", icon: "fire"})
                errorSet = true;
              } else if (err.response.status === 404) {
                setResolveError({ text: <>Could not find the film <code>{film.toUpperCase()}</code></>, code: "Error: 404 Not Found", icon: "search"})
                errorSet = true;
              }
            }

            // Set a generic error
            if (!errorSet) {
              setResolveError({ text: "Failed to connect to Glacier", code: "Unknown Error"});
            }
          }
        });

      return () => {
        mounted = false;
        cancelToken.cancel();
      }
    }
  }, [ film, resolveError ]);

  // Navigate to film page
  const handleClick = e => {
    if (!error && !resolveError && resolvedFilm && resolvedFilm.fingerprint) navigate("/glacier/film/" + resolvedFilm.fingerprint);
    typeof onClick === "function" && onClick(e);
  }

  return (
    <div {...rest} style={{ position: "relative", maxWidth: "100%" }} onClick={resolvedFilm? handleClick : void 0}>

      <FilmCard
        film={resolvedFilm}
      />

      <StandardOverlay
        active={!!resolveError}
        text={resolveError? resolveError.text : void 0}
        code={resolveError && resolveError.code? resolveError.code : "Unknown error"}
        icon={resolveError && resolveError.icon? resolveError.icon : "api"}
        button="Retry"
        onButton={() => { error? onRetry() : setResolveError(null) }}
        dim={!!resolveError}
        background
      />

    </div>
  );
};
