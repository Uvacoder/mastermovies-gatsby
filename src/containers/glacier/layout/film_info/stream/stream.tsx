import "plyr/dist/plyr.css";
import React, { useCallback, useEffect, useState } from "react";
import { apiUrl, API_PATHS } from "../../../../../services/api/routes";
import { IStyleProps } from "../../../../../types/component";
import { IGlacierExport, IGlacierThumbnail } from "../../../../../types/glacier";
import "./stream.module.css";

const Plyr = typeof window !== "undefined" ? require("plyr") : null;

interface IStreamProps {
  initalExport: IGlacierExport;
  filmExports: IGlacierExport[];
  filmAuthorisation: string;
  filmThumbnails?: IGlacierThumbnail[];
}

export const GlacierStream: React.FC<IStreamProps & IStyleProps> = ({
  initalExport,
  filmExports: exps,
  filmAuthorisation: authorisation,
  filmThumbnails: thumbs,
  className,
  style,
}) => {
  const [ref, setRef] = useState(null);
  const callback = useCallback((node) => {
    if (node) {
      setRef(node);
    }
  }, []);

  const [player, setPlayer] = useState<typeof Plyr>(null);

  useEffect(() => {
    if (ref) {
      const newPlayer = new Plyr(ref);
      setPlayer(newPlayer);

      // Fixes volume control bug
      const volumeHandler = (_e) => {
        newPlayer.currentTime = newPlayer.currentTime;
      };
      newPlayer.on("loadeddata", volumeHandler);

      return () => {
        newPlayer.off("loadeddata", volumeHandler);
        newPlayer.destroy();
        setPlayer(null);
      };
    }
  }, [ref]);

  useEffect(() => {
    if (!player) return;

    const source = {
      type: "video",
      poster: apiUrl(API_PATHS.GLACIER.THUMBNAIL_STREAM(getBestThumbnailId(thumbs))),
      sources: exps.map((exp) => ({
        type: exp.mime,
        size: mapWidth(exp.width),
        src: apiUrl(
          API_PATHS.GLACIER.EXPORT_DOWNLOAD(exp.id, {
            authorisation,
          })
        ),
      })),
    };

    player.source = source;

    player.quality = mapWidth(initalExport.width);
  }, [player, exps]);

  return <video key="glacier-stream" ref={callback} playsInline controls className={className} style={style} />;
};

function getBestThumbnailId(thumbs?: IGlacierThumbnail[]): number | null {
  if (!thumbs || thumbs.length === 0) return null;

  let width = 0;
  let height = 0;
  let id = null;

  for (const thumb of thumbs) {
    if ((thumb.width > width || thumb.height > height) && thumb.mime === "image/jpeg") {
      width = thumb.width;
      height = thumb.height;
      id = thumb.id;
    }
  }

  return id;
}

function mapWidth(width: number): number {
  if (width >= 3840) return 2160;
  if (width >= 2880) return 1440;
  if (width >= 1920) return 1080;
  if (width >= 1280) return 720;
  if (width >= 960) return 480;
  if (width >= 720) return 360;
  return 240;
}
