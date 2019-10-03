import React, { FunctionComponent } from "react";
import { Overwrite, Subtract } from "utility-types";

import { useGlacierFilm } from "../../../hooks/api/glacier";
import { IGlacier } from "../../../types/glacier";
import { GlacierFilm, IGlacierFilmProps } from "./film";

type reducedFilmCardProps = Subtract<IGlacierFilmProps, { film?: IGlacier }>;
interface IGlacierFilmResolver extends reducedFilmCardProps {
  film: number;
  onClick: () => void;
}

/**
 * A smart component that will attempt to resolve a film from it's fingerprint, while passing
 * down all original props, such as error and retry. If an internal error occurs, the error
 * props will be overwritten to reflect the internal retry functions.
 */
export const GlacierFilmResolver: FunctionComponent<Overwrite<IGlacierFilmProps, IGlacierFilmResolver>> = ({
  film,
  error,
  onRetry,
  onClick,
}) => {
  const [resolvedFilm, resolveError, retry] = useGlacierFilm(film);

  return (
    <GlacierFilm
      error={error ? error : resolveError}
      film={resolvedFilm}
      onRetry={error ? onRetry : retry}
      onClick={onClick}
    />
  );
};
