import { Icon, Tooltip, Typography } from "antd";
import classnames from "classnames";
import React from "react";

import { IHumanError } from "../../../types/app";
import { IGlacier } from "../../../types/glacier";
import { StandardOverlay } from "../../common/standard_overlay";
import { GlacierThumbnail } from "../thumbnail";
import styles from "./film.module.css";

export interface IGlacierFilmProps {
  film?: IGlacier;
  error?: IHumanError;
  className?: string;
  aspectRatio?: number;
  onRetry?: () => void;
  onClick?: () => void;
}

export const GlacierFilm = React.memo<IGlacierFilmProps>(
  ({ film, error, onRetry, onClick, aspectRatio, className }) => (
    <div className={classnames(styles.film, className)} onClick={onClick}>
      <div style={aspectRatio ? { paddingTop: `${(1 / aspectRatio) * 100}%` } : void 0}>
        <GlacierThumbnail cover thumbnails={film ? film.thumbnails : void 0} />
        <StandardOverlay
          active={!!error}
          icon={error ? error.icon : void 0}
          text={error ? error.text : void 0}
          button="Retry"
          onButton={onRetry}
          style={{ zIndex: 20 }}
        />
      </div>

      <div className={styles.summary}>
        <div className={styles.title}>
          {film ? film.name : <span className={styles.titleSkeleton} />}
          <span className={styles.release}>
            {film ? (
              film.release ? (
                new Date(film.release).getFullYear()
              ) : (
                ""
              )
            ) : (
              <span className={styles.releaseSkeleton} />
            )}
          </span>
          {film && !film.public && (
            <Tooltip title="Requires key">
              <Icon className={styles.lock} type="lock" />
            </Tooltip>
          )}
        </div>
        <div className={styles.description}>
          {film ? (
            <Typography.Paragraph children={film.description} ellipsis={{ rows: 3 }} />
          ) : (
            <span className={styles.descriptionSkeleton} />
          )}
        </div>
      </div>
    </div>
  )
);

/** Shorten some text and add an ellipsis if necessary */
export function shorten(text: string, length: number) {
  if (!text) return "";
  return text.length > length ? text.substr(0, length).trim() + "…" : text;
}
