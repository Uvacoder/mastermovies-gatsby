import { FluidObject } from "gatsby-image";

import { API_PATHS, apiUrl } from "../../../services/api/routes";
import { IGlacierThumbnail } from "../../../types/glacier";

/** A thumbnail image ID */
type ID = number;
type Dimension = number;

/** Save a value with reference to the image size used to calculate it */
interface IIDWithSize {
  id: ID;
  width: number;
  height: number;
}

export function glacierToFluid(thumbnails: IGlacierThumbnail[]): FluidObject | null {
  if (thumbnails.length === 0) return null;

  let aspectRatio: number = 1;

  const src: IIDWithSize = { id: null, width: 0, height: 0 };
  const srcSet: IIDWithSize[] = [];

  const srcWebp: IIDWithSize = { id: null, width: 0, height: 0 };
  const srcSetWebp: IIDWithSize[] = [];

  const svg: IIDWithSize = { id: null, width: 0, height: 0 };

  let lastWidth: Dimension = 0;
  let lastHeight: Dimension = 0;

  // Process each thumbnail
  for (const thumb of thumbnails) {
    // If the image is larger, update aspectRatio, src and srcSet
    if (thumb.width >= lastWidth && thumb.height >= lastHeight) {
      aspectRatio = thumb.width / thumb.height;
      if (thumb.mime === "image/jpeg" && thumb.width > src.width && thumb.height > src.height) {
        src.id = thumb.id;
        src.width = thumb.width;
        src.height = thumb.height;
      } else if (thumb.mime === "image/webp" && thumb.width > srcWebp.width && thumb.height > srcWebp.height) {
        srcWebp.id = thumb.id;
        srcWebp.width = thumb.width;
        srcWebp.height = thumb.height;
      }

      lastWidth = thumb.width;
      lastHeight = thumb.height;
    }

    // Handle JPEG, WebP and SVG sorting
    if (thumb.mime === "image/jpeg") {
      srcSet.push({ id: thumb.id, width: thumb.width, height: thumb.height });
    } else if (thumb.mime === "image/webp") {
      srcSetWebp.push({ id: thumb.id, width: thumb.width, height: thumb.height });
    } else if (thumb.mime === "image/svg+xml") {
      if (thumb.width > svg.width && thumb.height > svg.height) {
        svg.id = thumb.id;
        svg.width = thumb.width;
        svg.height = thumb.height;
      }
    }
  }

  // Build the final FluidObject based on all processed thumbnails
  return {
    aspectRatio,
    src: buildSrc(src),
    srcWebp: buildSrc(srcWebp),
    srcSet: buildSrcSet(srcSet),
    srcSetWebp: buildSrcSet(srcSetWebp),
    sizes: "(max-width: 1920px) 100vw, 1920px", // TODO assume the thumbnail can reach fullscreen,
    tracedSVG: buildSrc(svg),
  };
}

function buildSrc(id: IIDWithSize): string {
  if (id.id === null) return "";
  return apiUrl(API_PATHS.GLACIER.THUMBNAIL_STREAM(id.id));
}

function buildSrcSet(ids: IIDWithSize[]): string {
  return ids.map(v => `${apiUrl(API_PATHS.GLACIER.THUMBNAIL_STREAM(v.id))} ${Math.ceil(v.width)}w`).join(", ");
}
