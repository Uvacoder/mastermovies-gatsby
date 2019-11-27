import { Divider, Icon, Popover, Typography } from "antd";
import { navigate } from "gatsby";
import React, { FunctionComponent, ReactNode, useState } from "react";

import { IconMargin } from "../../../../components/common/icon_margin";
import { Modal } from "../../../../components/common/modal";
import { Portal } from "../../../../components/common/portal";
import { Skeleton } from "../../../../components/common/skeleton";
import { StandardOverlay } from "../../../../components/common/standard_overlay";
import { DarkButton } from "../../../../components/glacier/dark_button";
import { GlacierFilmTitle } from "../../../../components/glacier/film_meta";
import { GlacierThumbnail } from "../../../../components/glacier/thumbnail";
import { useGlacierFilm } from "../../../../hooks/api/glacier";
import { IGlacier } from "../../../../types/glacier";
import { GlacierDownloads } from "./downloads";
import styles from "./film_info.module.css";
import { GlacierNotSpecified } from "./not_specified";

interface IGlacierFilmInfoProps {
  film: string;
}

export const GlacierFilmInfo: FunctionComponent<IGlacierFilmInfoProps> = ({ film }) => {
  const validFilm = !isNaN((film as unknown) as number) ? parseInt(film, 10) : void 0;

  const [resolvedFilm, error, retry] = useGlacierFilm(validFilm);

  return (
    <div className={styles.filmInfo}>
      {!validFilm ? (
        <StandardOverlay
          active
          text={`"${film}" is not a valid film ID`}
          code="Invalid film ID"
          icon="close-circle"
          button="Return to Glacier"
          onButton={() => navigate("/glacier")}
        />
      ) : error ? (
        <StandardOverlay active text={error.text} code={error.code} icon={error.icon} button="Retry" onButton={retry} />
      ) : (
        <FilmInfo film={resolvedFilm} />
      )}
    </div>
  );
};

const FilmInfo: FunctionComponent<{ film?: IGlacier }> = ({ film }) => {
  return (
    <>
      <Header film={film} />
    </>
  );
};

const Header: FunctionComponent<{ film?: IGlacier }> = ({ film }) => (
  <>
    <div className={styles.nav}>
      <DarkButton large onClick={() => navigate("/glacier")}>
        <IconMargin type="left" marginRight /> Back to Glacier
      </DarkButton>
    </div>

    <div className={styles.filmInformation}>
      <div>
        <div className={styles.thumbnail}>
          <GlacierThumbnail
            thumbnails={film ? film.thumbnails : void 0}
            className={styles.thumbnailImage}
            borderRadius={8}
            fill
          />
        </div>
      </div>
      <div className={styles.rightColumn}>
        <div>
          <GlacierFilmTitle className={styles.titleText} name={film && film.name} release={film && film.release} />
        </div>

        <FilmInfoTable film={film} />
      </div>
    </div>

    <GlacierDownloads film={film} />
  </>
);

const FilmInfoTable: FunctionComponent<{ film?: IGlacier }> = ({ film }) => (
  <div className={styles.infoTable}>
    <FilmInfoProperty title="Access">
      {film &&
        (film.public ? (
          <>
            <Icon type="global" style={{ marginRight: 4 }} /> Public
          </>
        ) : (
          <>
            <Icon type="lock" style={{ marginRight: 4 }} /> Restricted
          </>
        ))}
    </FilmInfoProperty>
    <FilmInfoProperty title="Copyright" tooltip={film && !!film.copyright}>
      {film && (film.copyright || <GlacierNotSpecified />)}
    </FilmInfoProperty>
    <FilmInfoProperty title="Views">
      {film && (typeof film.views === "number" ? film.views.toString() : <GlacierNotSpecified />)}
    </FilmInfoProperty>
    <FilmInfoProperty title="Runtime">
      {film && (formatRuntime(film.runtime) || <GlacierNotSpecified />)}
    </FilmInfoProperty>
    <FilmInfoProperty title="Location" tooltip={film && !!film.location}>
      {film && (film.location || <GlacierNotSpecified />)}
    </FilmInfoProperty>
    <FilmInfoProperty title="Crew">
      {film && (film.crew ? <ViewCrew crew={film.crew} /> : <GlacierNotSpecified />)}
    </FilmInfoProperty>
    <Description
      description={
        film &&
        (splitToParagraphs(film.description) || <GlacierNotSpecified>This film has no description</GlacierNotSpecified>)
      }
    />
  </div>
);

const FilmInfoProperty: FunctionComponent<{ title?: ReactNode; tooltip?: boolean }> = ({
  title,
  children,
  tooltip = false,
}) => (
  <>
    <div className={styles.infoTableProperty}>{title}</div>
    <Popover
      // @ts-ignore
      trigger={tooltip ? "hover" : ""}
      content={tooltip ? children : void 0}
      mouseEnterDelay={0.5}
      placement="bottom"
    >
      <Typography.Text ellipsis style={{ color: "#fff" }} className={styles.infoTableValue}>
        {children || <Skeleton style={{ width: "6em" }} />}
      </Typography.Text>
    </Popover>
  </>
);

const Description: FunctionComponent<{ description?: ReactNode }> = ({ description }) => (
  <div className={styles.description}>
    <div className={styles.descriptionTitle}>Film Description</div>
    {description || <Skeleton count={3} shorter />}
  </div>
);

const ViewCrew: FunctionComponent<{ crew: { [index: string]: string } }> = ({ crew }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <span className={styles.link} onClick={() => setVisible(true)}>
        View
      </span>
      <Portal>
        <Modal active={visible} onBack={() => setVisible(false)} backText="Back to Glacier">
          <div key="crew" className={styles.crewModal}>
            <h3 className={styles.crewTitle}>
              <IconMargin type="team" marginRight /> Participants
            </h3>
            <p>
              The following people were involved in the making of this film.
              <br />
              This list may not be complete. For the full list, please consult the film credits.
            </p>
            <Divider />
            <div className={styles.crewGridWrapper}>
              <div className={styles.crewGrid}>
                {Object.entries(crew).map(([key, value]) => (
                  <React.Fragment key={`${key}-${value}`}>
                    <span className={styles.crewKey}>{key}</span>
                    <span className={styles.crewValue}>{value}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      </Portal>
    </>
  );
};

/** Format seconds into a pretty duration */
function formatRuntime(seconds?: number): string | undefined {
  if (!seconds) return void 0;

  if (seconds < 60) {
    const sDuration = Math.round(seconds);
    return `${sDuration} second${sDuration === 1 ? "" : "s"}`;
  }

  const sModDuration = Math.floor(seconds % 60);
  const mDuration = Math.round(seconds / 60);
  return `${mDuration} minute${mDuration === 1 ? "" : "s"} ${sModDuration} second${sModDuration === 1 ? "" : "s"}`;
}

/** Splits double `\n` characters into DOM paragraphs */
function splitToParagraphs(text?: string | null): ReactNode {
  if (typeof text !== "string") return text;
  return text.split("\n\n").map((t, i) => <p key={`${i}-${t.substr(0, 8)}`}>{t}</p>);
}
