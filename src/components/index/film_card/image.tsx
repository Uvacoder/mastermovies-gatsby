import Img, { FluidObject } from "gatsby-image";
import React, { FunctionComponent, useState, useEffect } from "react";

import { IGlacierFilmThumbnail } from "../../../api/glacier";
import { generateFluid } from "./generate_fluid";

interface IFilmCardImageProps {
  thumbnails: IGlacierFilmThumbnail[];
  className?: string;
}

export const FilmCardImage: FunctionComponent<IFilmCardImageProps> = ({
  thumbnails,
  className,
}) => {
  const [fluid, setFluid] = useState<FluidObject>(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (Array.isArray(thumbnails) && thumbnails.length > 0) {
      let isSubscribed = true;
      const { cancel, promise, aspectRatio } = generateFluid(thumbnails);
      setAspectRatio(aspectRatio);

      promise.then(data => {
        if (isSubscribed) {
          setFluid(data);
        }
      });

      return () => {
        isSubscribed = false;
        cancel();
      };
    }
  }, thumbnails);

  const resolvedFluid = fluid
    ? fluid
    : {
        aspectRatio,
        src: "",
        srcSet: "",
        srcWebp: "",
        srcSetWebp: "",
        sizes: "",
      };

  return <Img className={className} fluid={resolvedFluid} />;
};
