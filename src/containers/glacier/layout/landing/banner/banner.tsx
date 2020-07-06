import React from "react";

import { IGlacierSummary } from "../../../../../types/glacier";
import styles from "./banner.module.css";
import { GlacierReleases } from "./releases";
import { GlacierSpotlight } from "./spotlight";

interface IGlacierBannerProps {
  films?: IGlacierSummary[];
}

/** Contains the first section for glacier */
export const GlacierBanner: React.FC<IGlacierBannerProps> = ({ films }) => {
  if (films && films.length > 4) throw new Error("[GLACIER] Banner can not show more than 4 films!");

  const spotlight = films ? films[0] : void 0;
  const releases = films ? films.slice(1) : void 0;

  return (
    <>
      <div className={styles.banner}>
        <GlacierSpotlight film={spotlight} />
        <GlacierReleases films={releases} />
      </div>
    </>
  );
};
