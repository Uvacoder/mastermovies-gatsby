import { message } from "antd";
import React, { FunctionComponent } from "react";

import { IGlacierFilm, IGlacierFilmExport } from "../../../../../../api/glacier";
import { GlacierDownloadSummary } from "../common/summary";
import { GlacierDownloadExports } from "./exports";
import styles from "./overview.module.css";

interface IGlacierDownloadOverviewProps {
  film: IGlacierFilm;
  onDownload: (film: IGlacierFilmExport) => any;
}

export const GlacierDownloadOverview: FunctionComponent<IGlacierDownloadOverviewProps> = ({ film, onDownload }) => {

  return (
    <div className={styles.wrapper}>
      <GlacierDownloadSummary film={film}/>
      <GlacierDownloadExports filmExports={film.exports} onDownload={onDownload} onStream={() => message.info("Doesn't do anything yet!")} />
    </div>
  );

}