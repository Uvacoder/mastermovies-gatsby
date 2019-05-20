import { Button, Card, Icon } from "antd";
import { CardProps } from "antd/lib/card";
import Meta from "antd/lib/card/Meta";
import classnames from "classnames";
import React, { FunctionComponent, ReactNode, useMemo } from "react";

import { IGlacierFilm } from "../api/glacier";
import styles from "./film_card.module.css";
import { FilmCardImage } from "./film_card_thumbnail";
import { shorten } from "./shorten_text";

export interface IFilmCardProps extends CardProps {
  film?: IGlacierFilm;
  error?: string | boolean;
  errorIcon?: string;
  theme?: "light" | "dark";
  onClick?: () => any;
  onRetry?: () => any;
}

/** A Glacier film card, with support for "connecting", "failed" and a retry function */
export const FilmCard: FunctionComponent<IFilmCardProps> = ({ film, className, error, errorIcon, onRetry, onClick, theme, ...rest }) => {

  const cover = useMemo(() => generateCover(film), [film]);
  const meta  = useMemo(() => generateMeta(film), [film]);

  return (
    <Card
      {...rest}
      hoverable
      cover={cover}
      className={classnames(styles.root, className)}
      data-active={film && !error? "" : void 0}
      data-dark={theme === "dark" ? "" : void 0}
      onClick={onClick}
    >
      <Overlay error={error} errorIcon={errorIcon} onRetry={onRetry} />
      {meta}
    </Card>
  );

};

interface IOverlay {
  error?: string | boolean;
  errorIcon?: string;
  onRetry?: () => any;
}

/** Card overlay for "connecting" and "failed" states */
const Overlay: FunctionComponent<IOverlay> = ({ error, errorIcon = "api", onRetry = () => {} }) => (
  <div className={styles.overlay}>
    <span className={styles.overlayContainer} data-pending={!error? "" : void 0}>
      <Icon type={error? errorIcon : "cloud-upload"} className={styles.overlayIcon} />
      <span className={styles.overlayText}>{error === true ? "Failed to connect to Glacier" : (typeof error === "string" ? error : "Connecting to Glacier...")}</span>
      {error && <Button className={styles.overlayButton} onClick={onRetry}>Retry</Button>}
    </span>
  </div>
);

/** Generates the card cover image */
function generateCover(film: IGlacierFilm): ReactNode {
  return film && Array.isArray(film.thumbnails) && film.thumbnails.length > 0 ? (
    <FilmCardImage thumbnails={film.thumbnails} />
  ) : (
    <div className={styles.placeholder}>
      <div className={styles.placeholderContent}>
        <div className={styles.placeHolderSpacer} />
        <Icon type="stop" className={styles.overlayIcon} />
        No image
      </div>
    </div>
  );
}

/** Generate the card metadata */
function generateMeta(film: IGlacierFilm): ReactNode {
  if (!film) return null;

  const title = (
    <span className={styles.cardTitle}>{film.name}
      <span className={styles.release}>
        {film.release ? new Date(film.release).getFullYear() : ""}
      </span>
    </span>
  );

  const description = (<span className={styles.cardDescription}>{shorten(film.description, 120)}</span>);

  return <Meta title={title} className={styles.meta} description={description} />;
}
