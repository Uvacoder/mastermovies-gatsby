import { Button, Icon, message } from "antd";
import React, { FunctionComponent } from "react";

import { IconMargin } from "../../../../../../../components/common/icon_margin";
import { Modal } from "../../../../../../../components/common/modal";
import { Portal } from "../../../../../../../components/common/portal";
import { Spinner } from "../../../../../../../components/common/spinner";
import { StandardOverlay } from "../../../../../../../components/common/standard_overlay";
import { useAuthPayload } from "../../../../../../../hooks/api/auth";
import styles from "./auths.module.css";
import { GlacierMenuAuthsTable } from "./table";

export const GlacierMenuAuths: FunctionComponent<{
  active?: boolean;
  onActive: (active: boolean) => void;
}> = ({ active, onActive }) => (
  <Portal>
    <Modal active={active} onBack={() => onActive(false)} backText="Back to Glacier">
      <div className={styles.authContainer}>
        <h1 className={styles.title}>My authorisations</h1>

        <div className={styles.text}>
          <p>
            Your authorisations are a list of films that you have the right to access and freely downloaded from this
            device until the authorisation expires.
          </p>
          <p>
            A film authorisation is obtained automatically when you fulfil all the required download conditions for the
            film in question. It will expire after 24 hours and cannot be renewed.
          </p>
          <p>
            A film authorisation comes in the form of a cryptographic signature signed by the authorisation server,
            serving as your proof of right to access a particular film resource. This may then be used at any time to
            obtain a unique download token accepted by Glacier resource servers.
          </p>
          <p>
            Your authorisations are securely stored on (and uniquely tied to) this device as a part of you
            MasterMoviesID session. The session has several several safeguards in place to prevent malicious session
            hijacking, transfer or modification. You may end you session at any time by clicking the{" "}
            <Button
              size="small"
              onClick={() =>
                message.open({
                  type: "info",
                  content: "I don't do anything!",
                  duration: 1,
                  icon: <Icon type="smile" />,
                })
              }
            >
              <IconMargin type="logout" marginRight /> Logout
            </Button>{" "}
            option under the menu button. This will effectively destroy your access token, any active downloads will
            remain unaffected.
          </p>

          <Authorisations onClose={() => onActive(false)} />
        </div>
      </div>
    </Modal>
  </Portal>
);

/** Loads the session token and displays active authorisations */
const Authorisations: FunctionComponent<{ onClose: () => void }> = ({ onClose }) => {
  const [payload, error, retry] = useAuthPayload();

  const auths = payload && payload.glacier && payload.glacier.auth && Object.entries(payload.glacier.auth);

  return (
    <div className={styles.authorisations}>
      {typeof payload === "undefined" ? (
        <Spinner active delay={500} />
      ) : error ? (
        <StandardOverlay active text={error.text} code={error.code} icon={error.icon} button="Retry" onButton={retry} />
      ) : auths && auths.length > 0 ? (
        <>
          <h2 className={styles.authorisationsTitle}>
            You have {auths.length} active film authorisation{auths.length !== 1 && "s"}
          </h2>

          <GlacierMenuAuthsTable
            films={auths.map(([key, value]) => ({ id: Number(key), expiry: value }))}
            onClose={onClose}
          />
        </>
      ) : (
        <div className={styles.noAuth}>
          <IconMargin type="container" marginRight /> You have no active film authorisations
        </div>
      )}
    </div>
  );
};
