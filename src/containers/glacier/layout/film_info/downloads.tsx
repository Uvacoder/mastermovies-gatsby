import { Icon, Typography } from "antd";
import classnames from "classnames";
import fileSize from "file-size";
import React, { FunctionComponent, useState } from "react";

import { AnimatedStyle } from "../../../../components/common/animated_style";
import { IconMargin } from "../../../../components/common/icon_margin";
import { Modal } from "../../../../components/common/modal";
import { Portal } from "../../../../components/common/portal";
import { Spinner } from "../../../../components/common/spinner";
import { DarkButton } from "../../../../components/glacier/dark_button";
import { API_PATHS, apiUrl } from "../../../../services/api/routes";
import { IGlacier, IGlacierExport } from "../../../../types/glacier";
import { GlacierTitle } from "../landing/title";
import { EAuthStatus, GlacierDownloadAuth } from "./auth";
import styles from "./downloads.module.css";
import { GlacierNotSpecified } from "./not_specified";

export const GlacierDownloads: FunctionComponent<{ film?: IGlacier }> = ({ film }) => {
  const [selectedExport, setSelectedExport] = useState<number>(null);
  const [authStatus, setAuthStatus] = useState<EAuthStatus>(EAuthStatus.READY);
  const [downloadToken, setDownloadToken] = useState<string>(void 0);

  const authReady = selectedExport !== null;

  return (
    <div className={styles.downloads}>
      <GlacierTitle>
        Downloads
        <HelpModal />
      </GlacierTitle>

      <div className={styles.exports}>
        <Spinner key="spinner" active={!film} />

        {film &&
          (film.exports.length === 0 ? (
            <div className={styles.noExports}>There are no exports available for this film</div>
          ) : (
            film.exports
              .sort(sortExports)
              .map(exp => (
                <ExportCard
                  key={exp.id}
                  exp={exp}
                  selected={exp.id === selectedExport}
                  onSelect={() => setSelectedExport(exp.id)}
                />
              ))
          ))}
      </div>

      <AnimatedStyle to={{ opacity: authReady ? 1 : 0.4, pointerEvents: authReady ? "initial" : "none" }}>
        <div className={styles.auth}>
          <GlacierDownloadAuth
            filmId={(authReady && film && film.id) || void 0}
            status={authStatus}
            onStatus={setAuthStatus}
            onDownloadToken={setDownloadToken}
          />
        </div>
      </AnimatedStyle>

      <AnimatedStyle
        to={{
          opacity: authStatus === EAuthStatus.SUCCESS ? 1 : 0.4,
          pointerEvents: authStatus === EAuthStatus.SUCCESS ? "initial" : "none",
        }}
      >
        <div className={styles.downloadButtons}>
          <DownloadButtons
            onDownload={() => download(selectedExport, downloadToken)}
            onStream={() => stream(selectedExport)}
          />
        </div>
      </AnimatedStyle>
    </div>
  );
};

const ExportCard: FunctionComponent<{ exp: IGlacierExport; selected: boolean; onSelect: () => void }> = ({
  exp,
  selected,
  onSelect,
}) => (
  <div className={classnames(styles.exportCard, styles.selectable, { [styles.selected]: selected })} onClick={onSelect}>
    <Title width={exp.width} />

    <div className={styles.properties}>
      <Property title="Codec">
        {exp.video_codec && exp.audio_codec ? `${exp.video_codec} / ${exp.audio_codec}` : <GlacierNotSpecified />}
      </Property>
      <Property title="Size">
        {typeof exp.size === "string" ? fileSize(Number(exp.size), { fixed: 1 }).human("si") : <GlacierNotSpecified />}
      </Property>
      <Property title="Bitrate">
        {typeof exp.bitrate === "number" ? formatBitrate(Number(exp.bitrate)) : <GlacierNotSpecified />}
      </Property>
      <Property title="Checksum">
        <ChecksumModal checksum={exp.checksum} />
      </Property>
    </div>
  </div>
);

const Title: FunctionComponent<{ width: number }> = ({ width }) => {
  const [title, colour, description] =
    width >= 3840
      ? ["2160p", "#F012BE", "Ultra-High Definition"]
      : width >= 2560
      ? ["1440p", "#FF851B", "Better than High Definition"]
      : width >= 1920
      ? ["1080p", "#39CCCC", "Full High Definition"]
      : width >= 1280
      ? ["720p", "#7FDBFF", "High Definition"]
      : [`${width}p`, "#DDD", "Standard Definition"];

  return (
    <div className={styles.title}>
      <div className={styles.titleText}>{title}</div>
      <div className={styles.titleDescription} style={{ color: colour }}>
        {description}
      </div>
    </div>
  );
};

const Property: FunctionComponent<{ title: string }> = ({ title, children }) => (
  <>
    <div className={styles.propertyTitle}>{title}</div>
    <div>{children}</div>
  </>
);

const DownloadButtons: FunctionComponent<{ onDownload: () => void; onStream: () => void }> = ({
  onDownload,
  onStream,
}) => (
  <>
    <DarkButton className={styles.downloadButton} onClick={onDownload}>
      <IconMargin marginRight type="download" /> Download
    </DarkButton>
    <DarkButton className={styles.streamButton} onClick={onStream}>
      <IconMargin marginRight type="play-circle" /> Stream
    </DarkButton>
  </>
);

/** Sort exports with larger coming first */
function sortExports(a: IGlacierExport, b: IGlacierExport): number {
  if (!isNaN(Number(a.size)) && !isNaN(Number(b.size))) {
    return Number(b.size) - Number(a.size);
  }

  if (b.width && a.width) return b.width - a.width;

  return 0;
}

const HelpModal: FunctionComponent = () => {
  const [active, setActive] = useState<boolean>(false);

  const ratio = window.devicePixelRatio || 1;
  const resolution =
    window && window.screen && window.screen.width && window.screen.height
      ? [window.screen.width * ratio, window.screen.height * ratio]
      : null;
  const recommendedSize =
    resolution &&
    (resolution[0] >= 3840
      ? "2160p or higher"
      : resolution[0] >= 2560
      ? "1440p"
      : resolution[0] >= 1920
      ? "1080p"
      : resolution[0] >= 1280
      ? "720p"
      : "below 720p");
  const resolutionMessage = resolution && (
    <>
      &nbsp;We have detected the size of your screen to be <b>{`${resolution[0]}x${resolution[1]}`}</b>, and therefore
      recommend a download of <b>{recommendedSize}</b>.
    </>
  );

  return (
    <>
      <Icon type="question-circle" className={styles.helpIcon} onClick={() => setActive(true)} />
      <Portal>
        <Modal active={active} backText="Back to Glacier" onBack={() => setActive(false)}>
          <div className={styles.modalContainer}>
            <h3>
              <IconMargin type="question-circle" marginRight /> Help me out here!?
            </h3>
            <p style={{ borderLeft: "3px solid #39CCCC", paddingLeft: 8 }}>
              Depending on availability, you may choose from multiple film exports. For the simplest answer, choose the
              resolution that best matches your screen.{resolutionMessage}
            </p>
            <h3 style={{ textAlign: "center" }}>More information</h3>
            <p>
              Each algorithm provides a balance between visual quality and file size. Quality mainly depends on factors
              such as the <i>image resolution</i>, <i>bitrate</i> (data per second of video) and
              <i>compression algorithm</i> used.
            </p>
            <p>
              <b>Resolution:</b> Video resolution is based on the number of vertical/horizontal pixels in the frame.
              It's denoted by a short identifier, such as <i>2160p</i>, meaning roughly 2160 pixels vertically. The
              standard screen dimensions are 1920x<b>1080p</b>. Anything above is considered superior to High
              Definition. Viewing a video resolution larger than your screen provides little to no benefit, however, you
              can still benefit from the higher <i>bitrate</i> that higher resolutions require.
            </p>
            <p>
              <b>Bitrate:</b> The number of bits (1s or 0s) of data used to encode a second of video. A higher bitrate
              means less compression artefacts, but a higher resulting file size. MasterMovies uses superior bitrates
              that best suits the video resolution and content type.
            </p>
            <p>
              <b>File Size:</b> The size impacts the time it takes to download, as well as the storage space that will
              be occupied on your device.
            </p>
            <p>
              <b>Video/Audio Codec:</b> The algorithm used to compress the media. Newer algorithms can preserve "better"
              quality at lower bitrates as well as high-end video features such as 10-bit colour and High Dynamic Range,
              but are less compatible with older devices and require more processing power to decode. For the best
              compatibility, choose <b>H.264/AAC</b>. Next-generation codecs include <b>H.256 (HEVC)/AAC</b> and{" "}
              <b>VP9/Opus</b>.
            </p>
          </div>
        </Modal>
      </Portal>
    </>
  );
};

const ChecksumModal: FunctionComponent<{ checksum?: { [index: string]: string } }> = ({ checksum }) => {
  const [active, setActive] = useState<boolean>(false);

  return checksum ? (
    <>
      <a
        onClick={event => {
          setActive(true);
          event.stopPropagation();
        }}
        className={styles.lighterLink}
      >
        Open
      </a>
      <Portal>
        <Modal active={active} onBack={() => setActive(false)} backText="Back to Glacier">
          <div className={styles.modalContainer}>
            <h3>
              <IconMargin type="file-protect" marginRight /> File checksums
            </h3>
            <p>
              Checksums are used to ensure the integrity of a file after it has been transmitted from one storage device
              to another.
            </p>
            <p>
              The checksum is calculated using a hash function, which generates a short but unique signature of the
              file.
            </p>
            {/* TODO convert to grid */}
            {Object.entries(checksum).map(([key, value]) => (
              <div className={styles.checksumRow}>
                <span className={styles.modalProperty}>{key.toUpperCase()}</span>
                <Typography.Text key={key} copyable={{ text: value }} ellipsis>
                  {value}
                </Typography.Text>
              </div>
            ))}
          </div>
        </Modal>
      </Portal>
    </>
  ) : (
    <GlacierNotSpecified>No checksum information</GlacierNotSpecified>
  );
};

function formatBitrate(bitrate?: number): string | undefined {
  if (!bitrate) return void 0;

  let rate: number;
  let unit: string;

  if (bitrate < 1e3) {
    rate = Math.round(bitrate);
    unit = "bit/s";
  } else if (bitrate < 1e6) {
    rate = Math.round((bitrate * 10) / 1e3) / 10;
    unit = "kb/s";
  } else if (bitrate < 1e9) {
    rate = Math.round((bitrate * 10) / 1e6) / 10;
    unit = "Mb/s";
  } else {
    rate = Math.round((bitrate * 10) / 1e9) / 10;
    unit = "Gb/s";
  }

  return `${rate} ${unit}`;
}

/** Trigger a film download by clicking an anchor tag */
function download(exp: number, downloadToken: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    apiUrl(API_PATHS.GLACIER.EXPORT_DOWNLOAD(exp, { download: true, authorisation: downloadToken }))
  );
  element.setAttribute("download", "");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function stream(_exp: number) {
  Modal.info({
    icon: "frown",
    title: "Aw man",
    maskClosable: true,
    content: (
      <>
        <p>Video streaming isn't ready yet!</p>
        <p>This needs a bit more work on our end to provide a seamless experience. Check back later!</p>
      </>
    ),
  });
}
