import React, { FunctionComponent, ReactNode } from "react";
import { IGlacierFilmThumbnail } from "../../common/api/glacier";

import styles from "./film_card.module.css";

interface IGlacierFilmCardProps {
  name: string;
  release: string;
  description: string;
  thtm;
  thumbnails: IGlacierFilmThumbnail[];
}

export const GlacierFilmCard: FunctionComponent<IGlacierFilmCardProps> = ({
  name,
  release,
  description,
  thumbnails,
}) => (
  <div className={styles.root}>
    <div className={styles.cover}>{generatePicture(thumbnails)}</div>
    <div className={styles.title}>
      {name} <span className={styles.release}>{release}</span>
    </div>
    <div className={styles.description}>{description}</div>
  </div>
);

/** Convert film thumbnails into a dynamic <picture> element */
function generatePicture(thumbs: IGlacierFilmThumbnail[]): ReactNode {
  // Build a list of MIMEs
  const mime: {
    [index: string]: Array<{
      width: number;
      height: number;
      src: string;
    }>;
  } = {};

  // Sort the images
  for (const image of thumbs) {
    const stat = {
      width: image.width,
      height: image.height,
      src: image.image_url,
    };
    mime[image.mime]
      ? mime[image.mime].push(stat)
      : (mime[image.mime] = [stat]);
  }

  // Generate sources with srcset
  if (Object.keys(mime).length !== 0) {
    const sources = Object.entries(mime).map(([key, value]) => (
      <source
        key={key}
        type={key}
        srcSet={value.map(stat => `${stat.src} ${stat.width}w`).join(", ")}
      />
    ));

    return (
      <picture>
        {sources}
        <img alt="Film thumbnail" style={{ width: "100%" }} />
      </picture>
    );
  } else {
    return (
      <div className={placeholder} style={{ position: "relative", top: 32 }}>
        <Icon className={overlayIcon} type="close-circle" />
        <div className={overlayText}>No image</div>
      </div>
    );
  }
}

/** Shorten some text and add an ellipsis if necessary */
function shorten(text: string, length: number) {
  if (!text) return "";
  return text.length > length ? text.substr(0, length).trim() + "…" : text;
}
