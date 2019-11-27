import "plyr/dist/plyr.css";
import styles from "./film_player.module.css";

import React, { FunctionComponent, useCallback, useEffect, useState } from "react";

import { API_PATHS, apiUrl } from "../../../services/api/routes";
import { IGlacierExport, IGlacierThumbnail } from "../../../types/glacier";
import { GlacierLogo } from "../../common/logos";

import classnames from "classnames";
import { graphql, useStaticQuery } from "gatsby";

// tslint:disable-next-line:no-var-requires - Plyr import is not SSR compatible
const Plyr = typeof window !== "undefined" ? require("plyr") : null;

interface IFilmPlayerProps {
  /** All Glacier film exports for dynamic quality switching */
  exps: IGlacierExport[];
  /** The initially selected export */
  initial: IGlacierExport | "best" | "worst";
  /** The stream authorisation string */
  authorisation: string;
  /** Optional film thumbnails for the cover */
  thumbnails?: IGlacierThumbnail[];
}

type divProps = JSX.IntrinsicElements["div"];

/** Creates a Plyr-based film player with a Glacier watermark */
export const FilmPlayer: FunctionComponent<IFilmPlayerProps & divProps> = ({
  exps,
  initial,
  authorisation,
  thumbnails,
  className,
  ...rest
}) => {
  const [ref, setRef] = useState(null); // The player ref
  const callback = useCallback(node => {
    if (node) {
      setRef(node);
    }
  }, []);

  const [player, setPlayer] = useState<typeof Plyr>(null); // The Ployr instance

  const [playing, setPlaying] = useState<boolean>(false);

  const onPlay = () => {
    setPlaying(true);
  };

  const onPause = () => {
    setPlaying(false);
  };

  // Initialise the Plyr instance on ref change
  useEffect(() => {
    if (ref) {
      const newPlayer = new Plyr(ref);
      setPlayer(newPlayer);

      // Fixes volume control bug
      const volumeHandler = _e => {
        newPlayer.currentTime = newPlayer.currentTime;
      };
      newPlayer.on("loadeddata", volumeHandler);
      newPlayer.on("playing", onPlay);
      newPlayer.on("pause", onPause);

      return () => {
        newPlayer.off("loadeddata", volumeHandler);
        newPlayer.off("playing", onPlay);
        newPlayer.off("pause", onPause);
        newPlayer.destroy();
        setPlayer(null);
      };
    }
  }, [ref]);

  // Manage the player quality settings
  useEffect(() => {
    if (!player) return;

    const source = {
      type: "video",
      poster: apiUrl(API_PATHS.GLACIER.THUMBNAIL_STREAM(getBestThumbnailId(thumbnails))),
      sources: exps.map(exp => ({
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

    if (typeof initial === "object") {
      player.quality = mapWidth(initial.width);
    } else if (typeof initial === "string") {
      player.quality = mapWidth(getExport(exps, initial).width);
    }
  }, [player, exps]);

  return (
    <div {...rest} className={classnames(styles.player, className)}>
      <video ref={callback} playsInline controls />
      <WaterMark active={!playing} />
    </div>
  );
};

const WaterMark: FunctionComponent<{ active: boolean }> = ({ active }) => {
  const { logo } = useStaticQuery(graphql`
    query {
      logo: file(relativePath: { eq: "logo/white.svg" }) {
        publicURL
      }
    }
  `);

  return (
    <div className={classnames(styles.watermark, { [styles.hide]: !active })}>
      <img src={logo.publicURL} className={styles.watermarkImage} />
      <GlacierLogo className={styles.watermarkLogo} />
    </div>
  );
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

/** Gets the worst/best export */
function getExport(exps: IGlacierExport[], mode: "best" | "worst") {
  return exps.reduce(
    (previous, current) =>
      mode === "worst" && previous.width > current.width
        ? current
        : previous.width < current.width
        ? current
        : previous,
    exps[0]
  );
}

/** Create height-based quality selectors */
function mapWidth(width: number): number {
  if (width >= 3840) return 2160;
  if (width >= 2880) return 1440;
  if (width >= 1920) return 1080;
  if (width >= 1280) return 720;
  if (width >= 960) return 480;
  if (width >= 720) return 360;
  return 240;
}
