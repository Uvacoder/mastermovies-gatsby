import { Badge, message, Tooltip, Icon, Button } from "antd";
import classnames from "classnames";
import React, { FunctionComponent, useEffect, useState, ReactNode } from "react";

import { getAuth, IMasterMoviesID } from "../../../../../../api/auth";
import { createCancelToken } from "../../../../../../api/common";
import styles from "./status.module.css";
import { GlacierActionsStatusTable } from "./table";
import Helmet from "react-helmet";

interface IGlacierActionsStatusProps {
  active: boolean;
}

// setData({ "2622ab0cc9f5": 1559732400, "097ee5cd5907": 1558732400,"097ee5cd5908": 1558732400,"097ee5cd5909": 1558732400,"097ee5cd5910": 1558732400,"097ee5cd5911": 1558732400,"097ee5cd5912": 1558732400,"097ee5cd5913": 1558732400 });

/** Query the MasterMovies ID token and list authorized films */
export const GlacierActionsStatus: FunctionComponent<IGlacierActionsStatusProps> = ({
  active
}) => {

  const [ data, setData ] = useState<IMasterMoviesID["glacier"]["authorizations"]>(null);
  const [ message, setMessage ] = useState<ReactNode>(null);
  const [ error, setError ] = useState<boolean>(false);

  useEffect(() => {
    if (active) {

      setError(false);
      setMessage(null);
      setData(null);

      let mounted = true;
      const cancelToken = createCancelToken();

      getAuth(cancelToken.token)
        .then(data => {

          if (mounted) {
            if (!data || data === {}) {
              setMessage(<><Icon type="container" className={styles.messageIcon} /> You do not have an active MasterMovies ID token.</>);
            } else if (typeof data.glacier === "undefined" || typeof data.glacier.authorizations === "undefined") {
              setMessage(<><Icon type="container" className={styles.messageIcon} /> You don't have any authorised films.</>);
            } else {
              setData(data.glacier.authorizations);

            }
          }

        })
        .catch(err => {
          if (mounted) {
            setMessage(<><Icon type="api" className={styles.messageIcon} /> Unable to reach Glacier API: {err.message}</>);
            setError(true);
          }
        });

      return () => {
        mounted = false;
        cancelToken.cancel();
      }

    }
  }, [ active ]);

  return (
    <div className={styles.status}>

      <div className={styles.titleWrapper}>
        <span className={styles.title}>
          <Tooltip title={error? "Error" : !data && !message? "Connecting..." : "Online"} placement="bottom">
            <Badge status={error? "error" : !data && !message? "processing" : "success"} className={styles.titleDot} />
          </Tooltip>
          MasterMovies ID
        </span>
      </div>

      <div className={styles.text}>
        <p>
          Glacier's secure context is handled by MasterMovies ID. When a restricted video is unlocked,
          the Authorisation endpoint provides a cryptographically signed JSON Web Token which is used as
          proof of the user's rights to access the resource.
        </p>
        <p>
          Unlocking films with Glacier will give you a 24-hour access window to stream/download the film,
          after which you will need to unlock the video again.
        </p>
        <p>
          You may logout at any time by clicking <strong><Icon type="export"/> Logout</strong> under the MasterMovies ID menu.
          This may interrupt any active film downloads.
        </p>
      </div>


      {message && (
        <div className={classnames(styles.message, {[styles.error]: error})}>
          {message}
        </div>
        )}

      {!message && (
        <>
          <div className={styles.tableTitle}>Active authorisations</div>
          <GlacierActionsStatusTable data={data} />
        </>
      )}

    </div>
  );
}