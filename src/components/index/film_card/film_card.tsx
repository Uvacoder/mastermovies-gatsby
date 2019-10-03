import { Card } from "antd";
import { CardProps } from "antd/lib/card";
import classnames from "classnames";
import React, { FunctionComponent } from "react";

import { IGlacier } from "../../../types/glacier";
import { AspectRatio } from "../../common/aspect_ratio";
import { GlacierThumbnail } from "../../glacier/thumbnail";
import styles from "./film_card.module.css";

type cardProps = CardProps;
export interface IFilmCardProps extends cardProps {
  film?: IGlacier;
  onClick?: () => any;
}

/** Displays a Glacier film in a card-type style */
export const FilmCard: FunctionComponent<IFilmCardProps> = ({ film, onClick, className }) => (
  <Card
    hoverable
    cover={
      <AspectRatio ratio={2}>
        <GlacierThumbnail thumbnails={film && film.thumbnails ? film.thumbnails : void 0} fill cover />
      </AspectRatio>
    }
    className={classnames(styles.card, className)}
    onClick={onClick}
  >
    <Card.Meta
      title={
        film ? (
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
        )
      }
      description={
        film ? (
          <span className={styles.description}>
            {shorten(film.description, 120) || <i>This film has no description</i>}
          </span>
        ) : (
          <span className={classnames(styles.description, styles.descriptionSkeleton)} />
        )
      }
    />
  </Card>
);

/** Shorten some text and add an ellipsis if necessary */
export function shorten(text: string, length: number) {
  if (!text) return "";
  return text.length > length ? text.substr(0, length).trim() + "…" : text;
}
