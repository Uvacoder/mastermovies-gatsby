import React, { FunctionComponent, useEffect, useState } from "react";
import { Overwrite, Subtract } from "utility-types";

import { createCancelToken } from "../api/common";
import { getFilm, IGlacierFilm } from "../api/glacier";
import { FilmCard, IFilmCardProps } from "./film_card";

type reducedFilmCardProps = Subtract<IFilmCardProps, { film?: IGlacierFilm }>;
interface IFilmCardResolverProps extends reducedFilmCardProps {
  /** The fingerprint of the film */
  film: string;
}

/**
 * A smart component that will attempt to resolve a film from it's fingerprint, while passing
 * down all original props, such as error and retry. If an internal error occurs, the error
 * props will be overwritten to reflect the internal retry functions.
 */
export const FilmCardResolver: FunctionComponent<
  Overwrite<IFilmCardProps, IFilmCardResolverProps>
> = ({ film, error, onRetry, ...rest }) => {
  const [resolvedFilm, setResolvedFilm] = useState<IGlacierFilm>(null);
  const [resolveError, setResolveError] = useState<boolean>(false);

  useEffect(() => {
    if (!error && film) {
      const cancelToken = createCancelToken();

      getFilm(cancelToken.token, film)
        .then(setResolvedFilm)
        .catch(() => {
          setResolveError(true);
        });

      return cancelToken.cancel;
    }
  }, [film, error]);

  return (
    <FilmCard
      {...rest}
      error={resolveError ? resolveError : error}
      onRetry={resolveError ? () => setResolveError(false) : onRetry}
      film={resolvedFilm}
    />
  );
};
