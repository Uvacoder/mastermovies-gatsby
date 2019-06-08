import { Icon } from "antd";
import classnames from "classnames";
import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";

import { getAuth, IMasterMoviesID } from "../../../../../../api/auth";
import { createCancelToken } from "../../../../../../api/common";
import { Spinner } from "../../../../../../components/common/spinner";
import { MasterMoviesIDLogo } from "../../../../../../components/glacier/mastermovies_id";
import styles from "./status.module.css";
import { GlacierActionsStatusTable } from "./table";

interface IGlacierActionsStatusProps {
  active: boolean;
}

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
          View authorisations
        </span>
      </div>

      <div className={styles.text}>
        <p>
          Glacier's secure context is handled by <MasterMoviesIDLogo bolder />. When requesting access
          to a film resource, the user must always present a valid film authorisation provided
          by a trusted <MasterMoviesIDLogo bolder /> authority. Glacier merely serves content and does
          not implicate itself with access control.
        </p>
        <p>
          Your authorisations are securely stored in your browsers cookies inside a cryptographically
          signed JSON Web Token. This access token cannot be modified without corrupting the signature,
          and serves as your proof of right to access a particular film resource. When you successfully
          authorise a film, you have a 24-hour access window to download/stream the film, after which
          the authorisation will expire.
        </p>
        <p>
          You may end your session at any time by clicking <strong><Icon type="export"/> End session</strong> under
          the actions menu. This will effectively destroy your access token, and may interrupt any
          active film downloads.
        </p>
      </div>

      <div className={styles.tableWrapper}>
        {message? (
          <div className={classnames(styles.message, {[styles.error]: error})}>
            {message}
          </div>
        ) : data? (
          <>
            <div className={styles.tableTitle}>Your authorisations</div>
            <GlacierActionsStatusTable data={data} />
          </>
        ) : (
          <Spinner active={true} />
        )}

      </div>

    </div>
  );
}