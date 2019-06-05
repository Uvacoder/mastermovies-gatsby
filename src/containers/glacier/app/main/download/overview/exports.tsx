import { Button, Icon, Table, Tag, Tooltip } from "antd";
import classnames from "classnames";
import filesize from "file-size";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { throttle } from "throttle-debounce";

import { IGlacierFilmExport } from "../../../../../../api/glacier";
import styles from "./exports.module.css";

interface IGlacierDownloadExportsProps {
  filmExports: IGlacierFilmExport[];
  onDownload: (film: IGlacierFilmExport) => any;
  onStream: (film: IGlacierFilmExport) => any;
}

// Define the table columns
const columns = [
  {
    title: "Resolution",
    dataIndex: "resolution",
    key: "resolution",
    render: (res: [number, number]) => {
      const [ text, tag, colour, tooltip ] =
        res[0] >= 3840? ["2160p", "4K", "#F012BE", "Ultra-High Definition"]
      : res[0] >= 2560? ["1440p", "QHD", "#FF851B", "Better than High Definition"]
      : res[0] >= 1920? ["1080p", "FHD", "#39CCCC", "Full High Definition"]
      : res[0] >= 1280? ["720p", "HD", "#7FDBFF", "High Definition"]
      : [`${res[1]}p`, "SD", "#DDD", "Standard Definition"];

      return <span>
        <Tooltip title={`${res[0]}x${res[1]} (${tooltip})`}>
          <Tag style={{marginLeft: 8}} color={colour}>{tag}</Tag>
        </Tooltip>
        {text}
      </span>;
    }
  },
  {
    title: "Size",
    dataIndex: "size",
    key: "size",
    render: (bytes: number | string) => {
      const v = typeof bytes === "number"? bytes : parseInt(bytes);
      return !isNaN(v)? <Tooltip title={`${bytes} B`}>{filesize(v).human("si")}</Tooltip> : <i>Not specified</i>;
    }
  },
  {
    title: "Codec",
    dataIndex: "codec",
    key: "codec",
    render: (codecs: [string, string]) => `${codecs[0]} / ${codecs[1]}`
  },
  {
    title: "Fingerprint",
    dataIndex: "fingerprint",
    key: "fingerprint",
    render: (t: string) => <Tooltip title="MD5 checksum">{t.toUpperCase()}</Tooltip>
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: ([ onDownload, onStream, filmExport ]) => {
      if (!filmExport) return null;
      return (
        <>
          <Button type="primary" onClick={() => onDownload(filmExport)}>Download</Button>
          &nbsp;
          <Button onClick={() => onStream(filmExport)}>Stream</Button>
        </>
      );
    }
  }
];

/** Render a table with film exports, and download/stream buttons */
export const GlacierDownloadExports: FunctionComponent<IGlacierDownloadExportsProps> = ({ filmExports = [], onDownload, onStream }) => {

  if (filmExports.length === 0) return null;

  const data = [];

  for (let i=0; i<filmExports.length; i++) {
    const exp = filmExports[i];
    data.push({
      key: i,
      fingerprint: exp.fingerprint,
      resolution: [exp.width, exp.height],
      codec: [exp.video_codec, exp.audio_codec],
      size: exp.size,
      actions: [onDownload, onStream, exp]
    });
  }

  const ref = useRef<HTMLDivElement>(null);
  const [ showHint, setShowHint ] = useState<boolean>(false);

  useEffect(() => {
    if (open && ref.current) {
      const recalculateHint = throttle(500, () => {
        if (ref.current.scrollWidth > ref.current.clientWidth !== showHint) {
          setShowHint(!showHint);
        }
      });
      recalculateHint();
      window.addEventListener("resize", recalculateHint);
      return () => window.removeEventListener("resize", recalculateHint);
    }
  });


  return (
    <div className={styles.downloads}>
      <h2 className={styles.downloadsTitle}>Downloads</h2>
      <div ref={ref} className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ hideOnSinglePage: true, pageSize: 5 }}
        />
      </div>

      <div className={classnames(styles.tableHint, {[styles.show]: showHint})}>
        <Icon type="caret-left" />
        <span className={styles.tableHintText}>Scroll the table to see more</span>
        <Icon type="caret-right" />
      </div>
    </div>
  );

}