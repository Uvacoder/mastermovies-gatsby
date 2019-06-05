import { Icon, Tooltip } from "antd";
import classnames from "classnames";
import React from "react";

import { IGlacierFilm } from "../../../api/glacier";
import { GlacierThumbnail } from "../thumbnail";
import { StandardOverlay } from "../../common/standard_overlay";
import styles from "./film.module.css";

type divProps = JSX.IntrinsicElements["div"];
export interface IGlacierFilmProps extends divProps { // exported for resolver
  film?: IGlacierFilm;
  loading?: boolean;
  error?: string | boolean;
  errorIcon?: string;
  className?: string;
  aspectRatio?: number;
  onClick?: () => any;
  onRetry?: () => any;
  onOpen?: (film: string) => any; // if the film card is clicked and resolved
}

/** A Glacier film card, with support for "connecting", "failed" and a retry function */
export const GlacierFilm = React.memo<IGlacierFilmProps>(({
  film,
  loading,
  error,
  errorIcon,
  onRetry,
  onClick,
  onOpen,
  aspectRatio,
  className,
}) => (
  <div
    className={classnames(styles.film, className)}
    onClick={() => {
      if (film && onOpen) onOpen(film.fingerprint);
      if (onClick) onClick();
    }}
  >
    <div style={aspectRatio? {paddingTop: `${1/aspectRatio * 100}%`} : void 0}>
      <GlacierThumbnail theme="dark" mode="cover" thumbnails={film? film.thumbnails : void 0} loading={!error} />
      <StandardOverlay
        active={loading || !!error}
        icon={error? (errorIcon? errorIcon : "api") : "cloud-upload"}
        text={loading? "Connecting to Glacier..." : typeof error === "string"? error : "Failed to connect to Glacier"}
        button={error? "Retry" : void 0}
        onButton={error? onRetry : void 0}
        shimmer={loading}
        dim={!!error}
        style={{zIndex: 20}}
      />
    </div>

    <div className={styles.summary}>
      <div className={styles.title}>
        {film? film.name : <span className={styles.titleSkeleton} />}
        <span className={styles.release}>
          {film? (film.release ? new Date(film.release).getFullYear() : "") : <span className={styles.releaseSkeleton} /> }
        </span>
        {film && film.restricted && <Tooltip title="Requires key"><Icon className={styles.lock} type="lock" /></Tooltip>}
      </div>
      <div className={styles.description}>
        {film? shorten(film.description, 120) : <span className={styles.descriptionSkeleton} />}
      </div>
    </div>

  </div>
));

/** Shorten some text and add an ellipsis if necessary */
export function shorten(text: string, length: number) {
  if (!text) return "";
  return text.length > length ? text.substr(0, length).trim() + "…" : text;
}
