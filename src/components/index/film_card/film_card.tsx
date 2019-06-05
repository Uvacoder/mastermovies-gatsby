import { Card, Icon } from "antd";
import classnames from "classnames";
import React, { FunctionComponent, ReactNode, useMemo } from "react";

import { IGlacierFilm } from "../../../api/glacier";
import { StandardOverlay } from "../../common/standard_overlay";
import styles from "./film_card.module.css";
import { FilmCardImage } from "./image";

export interface IFilmCardProps {
  film?: IGlacierFilm;
  error?: string | boolean;
  errorIcon?: string;
  theme?: "light" | "dark";
  className?: string;
  onClick?: () => any;
  onRetry?: () => any;
}

/** Displays a Glacier film in a card-type style */
export const FilmCard: FunctionComponent<IFilmCardProps> = ({
  film,
  className,
  error,
  errorIcon,
  onRetry,
  onClick,
  theme
}) => {

  const cover = useMemo(() => generateCover(film), [film]);
  const meta = useMemo(() => generateMeta(film), [film]);

  return (
    <Card
      hoverable
      cover={cover}
      className={classnames(styles.card, {[styles.dark]: theme === "dark", [styles.active]: film && !error}, className)}
      onClick={onClick}
    >
      <StandardOverlay
        active={!film || !!error}
        icon={error? errorIcon : "cloud-upload"}
        text={error? (typeof error === "string"? error : "Failed to connect to Glacier") : "Connecting to Glacier..."}
        button={error? "Retry" : void 0}
        onButton={onRetry}
        theme={theme}
      />
      {meta}
    </Card>
  );
};

/** Generates the card cover image */
function generateCover(film: IGlacierFilm): ReactNode {
  return film &&
    Array.isArray(film.thumbnails) &&
    film.thumbnails.length > 0 ? (
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

  const { title, description } = generateSummary(film);

  return (
    <Card.Meta title={title} description={description} />
  );
}

function generateSummary(film: IGlacierFilm) {
  return {
    title: (
      <div className={styles.title}>
        {film.name}
        <span className={styles.release}>
          {film.release ? new Date(film.release).getFullYear() : ""}
        </span>
      </div>
    ),
    description: (
      <div className={styles.description}>
        {shorten(film.description, 120)}
      </div>
    )
  }
}

/** Shorten some text and add an ellipsis if necessary */
export function shorten(text: string, length: number) {
  if (!text) return "";
  return text.length > length ? text.substr(0, length).trim() + "…" : text;
}
