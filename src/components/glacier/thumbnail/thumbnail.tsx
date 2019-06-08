import classnames from "classnames";
import Img, { FluidObject } from "gatsby-image/withIEPolyfill";
import React, { CSSProperties, useEffect, useState } from "react";

import { IGlacierFilmThumbnail } from "../../../api/glacier";
import { Spinner } from "../../common/spinner";
import { generateFluid } from "./generate_fluid";
import styles from "./thumbnail.module.css";

interface IFilmCardImageProps {
  thumbnails?: IGlacierFilmThumbnail[];
  className?: string;
  style?: CSSProperties;
  mode?: "cover" | "contain";
  loading?: boolean;
  theme?: "light" | "dark";
  roundCorners?: boolean;
}

export const GlacierThumbnail = React.memo<IFilmCardImageProps>(({
  thumbnails,
  mode,
  loading = true,
  theme = "light",
  roundCorners = true,
  ...rest
}) => {

  const [ resolve, setResolve ] = useState<IGlacierFilmThumbnail[]>(null);
  const [ fluid, setFluid ] = useState<FluidObject>(null);

  // Start resolving a thumbnail
  useEffect(() => setResolve(thumbnails), [thumbnails]);

  // Do the resolving magic
  useEffect(() => {
    if (resolve) {
      if (!Array.isArray(thumbnails) || thumbnails.length === 0) {
        setResolve(null);
      } else {

        let mounted = true;
        const { cancel, promise } = generateFluid(thumbnails);

        promise.then(data => {
          if (mounted) {
            setFluid(data);
          }
        });

        return () => {
          mounted = false;
          cancel();
        };

      }
    }

  }, [ resolve ]);

  return (
    <div {...rest}>
      <div className={styles.placeholder}>
        <div className={classnames(styles.placeholderContent, mode === "cover"? styles.cover : styles.contain, {[styles.border]: roundCorners})}>
          {fluid? (
            <Img
              objectFit={mode === "contain"? "contain" : "cover"}
              className={styles.image}
              fluid={fluid}
            />
          ) : loading && (
            <span style={{minWidth: 32, minHeight: 32}}>
              <Spinner active={true} theme={theme} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
