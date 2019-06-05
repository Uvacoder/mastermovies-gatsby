import React, { FunctionComponent, useEffect, useState } from "react";
import { Overwrite, Subtract } from "utility-types";

import { createCancelToken } from "../../../api/common";
import { getFilm, IGlacierFilm } from "../../../api/glacier";
import { GlacierFilm, IGlacierFilmProps } from "./film";

type reducedFilmCardProps = Subtract<IGlacierFilmProps, { film?: IGlacierFilm }>;
interface IGlacierFilmResolver extends reducedFilmCardProps {
  film: string;
}

/**
 * A smart component that will attempt to resolve a film from it's fingerprint, while passing
 * down all original props, such as error and retry. If an internal error occurs, the error
 * props will be overwritten to reflect the internal retry functions.
 */
export const GlacierFilmResolver: FunctionComponent<
  Overwrite<IGlacierFilmProps, IGlacierFilmResolver>
> = ({ film, error, onRetry, onClick, ...rest }) => {
  const [resolvedFilm, setResolvedFilm] = useState<IGlacierFilm>(null);
  const [resolveError, setResolveError] = useState<boolean>(false);

  useEffect(() => {
    if (!error && !resolveError && film) {
      const cancelToken = createCancelToken();

      let mounted = true;
      // Promise.reject(new Error("bad"))
      getFilm(cancelToken.token, film)
        .then(data => mounted && setResolvedFilm(data))
        .catch(() => mounted && setResolveError(true));

      return () => {
        mounted = false;
        cancelToken.cancel();
      }
    }
  }, [film, error, resolveError]);

  return (
    <GlacierFilm
      {...rest}
      error={resolveError ? resolveError : error}
      onRetry={resolveError ? () => setResolveError(false) : onRetry}
      film={resolvedFilm}
    />
  );
};
