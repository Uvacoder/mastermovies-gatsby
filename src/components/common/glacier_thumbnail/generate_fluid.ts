import Axios from "axios";
import { FluidObject } from "gatsby-image";

import { createCancelToken } from "../api/common";
import { IGlacierFilmThumbnail } from "../api/glacier";

/* Generate a *fluid* object for gatsby-image */
export function generateFluid(
  thumbnails: IGlacierFilmThumbnail[]
): { promise: Promise<FluidObject>; cancel: () => void } {
  // Generate aspect ratio from largest dimensions
  const aspectRatio = { ratio: 1, width: 0, height: 0 };

  // Generate src from largest image
  const src = { src: "", width: 0, height: 0 };
  const srcWebp = { src: "", width: 0, height: 0 };
  const srcSet = [];
  const srcSetWebp = [];
  const base64 = { src: "", width: 0, height: 0 };

  for (const thumbnail of thumbnails) {
    // Set newest aspect ratio
    if (
      thumbnail.width > aspectRatio.width &&
      thumbnail.height > aspectRatio.height
    ) {
      aspectRatio.ratio = thumbnail.width / thumbnail.height;
      aspectRatio.width = thumbnail.width;
      aspectRatio.height = thumbnail.height;
    }

    // Update src and srcWebp
    if (thumbnail.mime === "image/webp") {
      if (
        thumbnail.width > srcWebp.width &&
        thumbnail.height > srcWebp.height
      ) {
        srcWebp.src = thumbnail.image_url;
        srcWebp.width = thumbnail.width;
        srcWebp.height = thumbnail.height;
      }
    } else if (thumbnail.width > src.width && thumbnail.height > src.height) {
      src.src = thumbnail.image_url;
      src.width = thumbnail.width;
      src.height = thumbnail.height;
    }

    // Update srcSet and srcSetWebp
    if (thumbnail.mime === "image/jpeg") {
      srcSet.push({ width: thumbnail.width, src: thumbnail.image_url });
    } else if (thumbnail.mime === "image/webp") {
      srcSetWebp.push({ width: thumbnail.width, src: thumbnail.image_url });
    }

    // Update base64
    if (thumbnail.mime === "image/svg+xml") {
      if (thumbnail.width > base64.width && thumbnail.height > base64.height) {
        base64.src = thumbnail.image_url;
      }
    }
  }

  const baseFluid = {
    aspectRatio: aspectRatio.ratio,
    sizes: "(max-width: 1920px) 100vw, 1920px", // assume the thumbnail can reach fullscreen
    src: src.src,
    srcWebp: srcWebp.src,
    srcSet: srcSet.map(x => `${x.src} ${x.width}w`).join(", "),
    srcSetWebp: srcSetWebp.map(x => `${x.src} ${x.width}w`).join(", "),
  };

  if (base64.src) {
    const cancelToken = createCancelToken();
    return {
      cancel: cancelToken.cancel,
      promise: new Promise(resolve => {
        Axios.get<string>(base64.src, { cancelToken: cancelToken.token })
          .then(data => {
            resolve({
              ...baseFluid,
              base64: `data:image/svg+xml,${encodeURIComponent(data.data)}`,
            });
          })
          .catch(() => {
            resolve(baseFluid);
          });
      }),
    };
  } else {
    return {
      promise: Promise.resolve(baseFluid),
      cancel: () => {},
    };
  }
}
