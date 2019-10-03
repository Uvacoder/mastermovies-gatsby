import { Empty } from "antd";
import classnames from "classnames";
import { FluidObject } from "gatsby-image";
import Img from "gatsby-image/withIEPolyfill";
import React, { FunctionComponent } from "react";

import { IStyleProps } from "../../../types/component";
import { IGlacierThumbnail } from "../../../types/glacier";
import { Spinner } from "../../common/spinner";
import { glacierToFluid } from "./glacier_to_fluid";
import styles from "./thumbnail.module.css";

interface IFilmCardImageProps extends IStyleProps {
  thumbnails?: IGlacierThumbnail[];
  /** Use `cover` instead of `contain`. You may also want the `fill` option. */
  cover?: boolean;
  /** Apply `width: 100%; height: 100%;` to the thumbnail wrapper */
  fill?: boolean;
  borderRadius?: number;
  /** Remove the aspect-ratio enforcement (requires explicit size!) */
  noAspectRatio?: boolean;
}

export const GlacierThumbnail: FunctionComponent<IFilmCardImageProps> = ({
  thumbnails,
  cover = false,
  fill = false,
  borderRadius,
  noAspectRatio,
  style,
  className,
}) => {
  const fluid: FluidObject | null | undefined = Array.isArray(thumbnails) ? glacierToFluid(thumbnails) : thumbnails;

  return fluid ? (
    <Img
      draggable={false}
      objectFit={cover ? "cover" : "contain"}
      className={className}
      style={{ borderRadius, width: fill ? "100%" : void 0, height: fill ? "100%" : void 0, ...style }}
      fluid={noAspectRatio ? { ...fluid, aspectRatio: 0 } : fluid}
    />
  ) : fluid === null ? (
    <div style={style} className={classnames(styles.thumbnailPlaceholder, className)}>
      <Empty description="No preview" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
  ) : (
    <div style={style} className={classnames(styles.thumbnailPlaceholder, className)}>
      <Spinner active />
    </div>
  );
};
