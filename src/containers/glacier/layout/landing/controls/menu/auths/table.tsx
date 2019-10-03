import { Badge, Button, Table, Tooltip } from "antd";
import Column from "antd/lib/table/Column";
import { navigate } from "gatsby";
import moment from "moment";
import React, { FunctionComponent } from "react";

import { IconMargin } from "../../../../../../../components/common/icon_margin";
import { Skeleton } from "../../../../../../../components/common/skeleton";
import { Spinner } from "../../../../../../../components/common/spinner";
import { GlacierThumbnail } from "../../../../../../../components/glacier/thumbnail";
import { useGlacierFilm } from "../../../../../../../hooks/api/glacier";
import styles from "./table.module.css";

interface IAuth {
  id: number;
  expiry: number;
}

/** Render out session authorisations in a table */
export const GlacierMenuAuthsTable: FunctionComponent<{ films: IAuth[]; onClose: () => void }> = ({
  films,
  onClose,
}) => {
  return (
    <Table rowKey="id" dataSource={films} pagination={{ hideOnSinglePage: true, pageSize: 10 }}>
      <Column
        title="Name"
        dataIndex="id"
        key="name"
        render={(id: number) => <FilmName film={id} onClose={onClose} />}
        align="center"
      />
      <Column
        title="Access"
        dataIndex="id"
        key="access"
        render={(id: number) => <FilmAccess film={id} />}
        align="center"
      />
      <Column
        title="Expires"
        dataIndex="expiry"
        key="expires"
        render={(expiry: number) => <ExpiresIn expiry={expiry} />}
        align="center"
      />
    </Table>
  );
};

/** Render the name and release year of the film */
const FilmName: FunctionComponent<{ film: number; onClose: () => void }> = ({ film, onClose }) => {
  const [resolvedFilm, error, retry] = useGlacierFilm(film);

  return error ? (
    <>
      <i>Error while fetching</i>
      <Button size="small" onClick={retry}>
        Retry
      </Button>
    </>
  ) : resolvedFilm ? (
    <span
      className={styles.filmName}
      onClick={() => {
        onClose();
        navigate("/glacier/film/" + film);
      }}
    >
      <GlacierThumbnail
        key="thumbnail"
        thumbnails={resolvedFilm.thumbnails}
        className={styles.filmThumbnail}
        borderRadius={2}
      />
      {resolvedFilm.name} <span className={styles.filmRelease}>{new Date(resolvedFilm.release).getFullYear()}</span>
    </span>
  ) : (
    <span className={styles.filmName}>
      <GlacierThumbnail key="thumbnail" className={styles.filmThumbnail} borderRadius={2} />
      <Skeleton />
    </span>
  );
};

/** Render the name and release year of the film */
const FilmAccess: FunctionComponent<{ film: number }> = ({ film }) => {
  const [resolvedFilm] = useGlacierFilm(film);

  return !resolvedFilm ? (
    <Skeleton />
  ) : resolvedFilm.public ? (
    <>
      <IconMargin type="global" marginRight /> Public
    </>
  ) : (
    <>
      <IconMargin type="lock" marginRight /> Restricted
    </>
  );
};

const ExpiresIn: FunctionComponent<{ expiry: number }> = ({ expiry }) => {
  const unix = moment().unix();
  const momentExpires = moment.unix(expiry);
  const expired = expiry <= unix;

  return (
    <Tooltip overlay={momentExpires.toString()}>
      {expired ? <b className={styles.expired}>Expired</b> : momentExpires.fromNow()}
    </Tooltip>
  );
};

// const ExpiresIn: FunctionComponent<{ expiry: number }> = ({ expiry }) => {
//   const unix = moment().unix();
//   const momentExpires = moment.unix(expiry);
//   const expired = expiry <= unix;

//   return <Tooltip overlay={momentExpires.toString()}>
//     <Badge dot status={expired? "error" : "success"} />{expired? <>Expired</> : momentExpires.fromNow()}
//   </Tooltip>;
// };
