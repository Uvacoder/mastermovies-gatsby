import { Table, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import React, { FunctionComponent, useEffect, useState } from "react";

import { IMasterMoviesID } from "../../../../../../api/auth";
import { createCancelToken } from "../../../../../../api/common";
import { getFilm, IGlacierFilm } from "../../../../../../api/glacier";
import { Spinner } from "../../../../../../components/common/spinner";
import styles from "./table.module.css";


interface IGlacierActionsStatusTableProps {
  data: IMasterMoviesID["glacier"]["authorizations"];
}

type alignType = ColumnProps<{}>["align"];
const columns = [
  {
    key: "title",
    title: "Title",
    dataIndex: "fingerprint",
    align: "center" as alignType,
    render: (x: string) => <Title film={x} />
  },
  {
    title: "Fingerprint",
    dataIndex: "fingerprint",
    align: "center" as alignType,
    render: (x: string) => x.toUpperCase()
  },
  {
    title: "Expires in",
    dataIndex: "expires",
    align: "center" as alignType,
    render: (x: number) => <ExpiresIn expires={x} />
  }
];

export const GlacierActionsStatusTable: FunctionComponent<IGlacierActionsStatusTableProps> = ({ data }) => (
  <Table
    dataSource={
      Object.entries(data).map(([ fingerprint, expires ]) => ({
        fingerprint,
        expires
      }))
    }
    columns={columns}
    pagination={{ hideOnSinglePage: true, pageSize: 5 }}
  />
)



/** Resolve film information and display it nicely */
const Title = React.memo<{ film: string }>(({ film }) => {

  const [ resolvedFilm, setResolvedFilm ] = useState<IGlacierFilm>(null);
  const [ error, setError ] = useState<boolean>(false);

  useEffect(() => {

    let mounted = true;
    let cancelToken = createCancelToken();
    if (error) setError(false);

    getFilm(cancelToken.token, film)
      .then(data => {
        if (mounted) setResolvedFilm(data);
      })
      .catch(() => {
        if (mounted) setError(true);
      });

      return () => {
        mounted = false;
        cancelToken.cancel();
      }

  }, [ film ]);

  if (!film) return null;


  return error? (
    <span className={styles.error}>Film not found</span>
  ) : (
    <div className={styles.wrapper}>
      {resolvedFilm? (
        <>
          <span className={styles.title}>{resolvedFilm.name}</span>
          <span className={styles.release}>{new Date(resolvedFilm.release).getFullYear()}</span>
        </>
      ) : (
        <Spinner active={true} />
      )}
      </div>
    );
});

/** Convert an epoch time to expires in hours, with a helpful date tooltip */
const ExpiresIn: FunctionComponent<{ expires: number }> = ({ expires }) => {
  const d = new Date(expires * 1000);
  const offset = d.valueOf() - Date.now();
  const prettyOffset = offset < 3600000? `${Math.ceil(offset / 60000)} minutes` : `${Math.ceil(offset / 360000)/10} hours`;

  const expiresIn = offset <= 0? <span className={styles.error}>Expired</span> : `Expires in ${prettyOffset}`;

  const formattedDate = `${d.getUTCFullYear()}-${lead(d.getUTCMonth(), 2)}-${lead(d.getUTCDay(), 2)} `
  + `${lead(d.getUTCHours(), 2)}:${lead(d.getUTCMinutes(), 2)}:${lead(d.getUTCSeconds(), 2)} UTC`;

  return <Tooltip title={formattedDate}><span className={styles.expires}>{expiresIn}</span></Tooltip>;
}

/** Add leading digits to a number */
function lead(number: number, digits: number): string {
  const x = number.toString();
  return "0".repeat(Math.max(0, digits - x.length)) + x;
}