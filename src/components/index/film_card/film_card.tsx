import { Card } from "antd";
import { CardProps } from "antd/lib/card";
import classnames from "classnames";
import React, { FunctionComponent } from "react";

import { IGlacierFilm } from "../../../api/glacier";
import { GlacierThumbnail } from "../../glacier/thumbnail";
import styles from "./film_card.module.css";

type cardProps = CardProps;
export interface IFilmCardProps extends cardProps {
  film?: IGlacierFilm;
  onClick?: () => any;
}

/** Displays a Glacier film in a card-type style */
export const FilmCard: FunctionComponent<IFilmCardProps> = ({
  film,
  onClick,
  className
}) => {

  // film = null;

  return (
    <Card
      hoverable
      cover={
      <GlacierThumbnail
        mode="cover"
        thumbnails={ film && film.thumbnails? film.thumbnails : void 0 }
        roundCorners={false}
      />
    }
      className={classnames(styles.card, { [styles.active]: film}, className)}
      onClick={onClick}
    >

      <Card.Meta title={film? (
        <>
          <span className={styles.title}>
            {film.name}
            <span className={styles.release}>{new Date(film.release).getFullYear()}</span>
          </span>
        </>
      ) : (
        <>
          <span className={classnames(styles.title, styles.titleSkeleton)} />
          <span className={classnames(styles.release, styles.releaseSkeleton)} />
        </>
      )} description={film? (
        <span className={styles.description}>{shorten(film.description, 120)}</span>
      ) : (
        <span className={classnames(styles.description, styles.descriptionSkeleton)} />
      )} />

    </Card>
  );
};

/** Shorten some text and add an ellipsis if necessary */
export function shorten(text: string, length: number) {
  if (!text) return "";
  return text.length > length ? text.substr(0, length).trim() + "…" : text;
}
