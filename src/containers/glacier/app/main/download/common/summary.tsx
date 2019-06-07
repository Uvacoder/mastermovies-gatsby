import { Badge, Row } from "antd";
import classnames from "classnames";
import React, { FunctionComponent } from "react";

import { IGlacierFilm } from "../../../../../../api/glacier";
import { Description } from "../../../../../../components/glacier/description";
import { GlacierThumbnail } from "../../../../../../components/glacier/thumbnail";
import styles from "./summary.module.css";

interface IGlacierDownloadSummaryProps {
  film: IGlacierFilm;
}

const NotSpecified = () => <i>Not specified</i>;

export const GlacierDownloadSummary: FunctionComponent<IGlacierDownloadSummaryProps> = ({ film }) => (
  <>
    <div className={styles.summaryRow}>
      <GlacierThumbnail thumbnails={film.thumbnails} className={styles.thumbnail} mode="contain" />

      <div className={styles.summary}>
        <div className={styles.header}>
          <SummaryTitle title={film.name} release={film.release} style={{ marginBottom: 32 }} />
        </div>
        <Description name="Restricted">
          {
            film.restricted?
            <><Badge status="warning" />Download key</>
            : <><Badge status="success" />Public</>
          }
        </Description>
        <Description name="Copyright">{film.copyright || <NotSpecified />}</Description>
        <Description name="Location">{film.location || <NotSpecified />}</Description>
        <Description name="Views">{film.views || "0"}</Description>
      </div>

    </div>

    <Row className={styles.description}>
      {film.description}
    </Row>
  </>
);


type divProps = JSX.IntrinsicElements["div"];
interface ISummaryTitleProps extends divProps {
  title: string;
  release: string;
}

export const SummaryTitle: FunctionComponent<ISummaryTitleProps> = ({ title, release, className, ...rest }) => (
  <div {...rest} className={classnames(styles.header, className)}>
    <span className={styles.title}>{title}</span>
    <span className={styles.release}>{new Date(release).getUTCFullYear()}</span>
  </div>
)