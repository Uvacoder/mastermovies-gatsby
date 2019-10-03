import { navigate } from "gatsby";
import React, { FunctionComponent } from "react";

import { useGlacierFilm } from "../../../hooks/api/glacier";
import { IHumanError } from "../../../types/app";
import { StandardOverlay } from "../../common/standard_overlay";
import { FilmCard } from "./film_card";

type divProps = JSX.IntrinsicElements["div"];
interface IFilmCardResolverProps extends divProps {
  /** The fingerprint of the film */
  film?: number;
  error?: IHumanError;
  onRetry?: () => any;
}

/**
 * Display a GlacierCard. Resolves the film from API based on id.
 * Supports error IHumanError pass-down and retry.
 */
export const FilmCardResolver: FunctionComponent<IFilmCardResolverProps> = ({
  film,
  onClick,
  error,
  onRetry,
  ...rest
}) => {
  const [resolvedFilm, resolveError, retry] = useGlacierFilm(typeof film === "number" ? film : void 0);

  // Pass through error/retry props if necessary
  const realError = error ? error : resolveError;
  const realRetry = error ? onRetry : retry;

  // Navigate to film page
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (resolvedFilm) {
      if (resolvedFilm.id) navigate("/glacier/film/" + resolvedFilm.id);
      if (typeof onClick === "function") onClick(e);
    }
  };

  return (
    <div {...rest} style={{ position: "relative", maxWidth: "100%" }} onClick={handleClick}>
      <FilmCard film={resolvedFilm} />

      <StandardOverlay
        active={!!realError}
        text={(realError && realError.text) || void 0}
        code={(realError && realError.code) || void 0}
        icon={(realError && realError.icon) || void 0}
        button="Retry"
        onButton={realRetry}
        dim={!!realError}
        background
      />
    </div>
  );
};
