import { Button, Icon, Tooltip } from "antd";
import classnames from "classnames";
import moment, { Moment } from "moment";
import React, { FunctionComponent, useEffect, useState } from "react";

import { AnimatedCheck } from "../../../../../../../components/common/animated_check";
import { IconMargin } from "../../../../../../../components/common/icon_margin";
import { Modal } from "../../../../../../../components/common/modal";
import { Portal } from "../../../../../../../components/common/portal";
import { cancelTokenSource } from "../../../../../../../lib/cancelToken";
import { authLogout, getAuthPayload } from "../../../../../../../services/api/auth";
import { IHumanError } from "../../../../../../../types/app";
import styles from "./logout.module.css";

/** Display a logout dialog with confirmation */
export const GlacierMenuLogout: FunctionComponent<{ active: boolean; onActive: (active: boolean) => void }> = ({
  active,
  onActive,
}) => {
  const [logout, setLogout] = useState<boolean>(false);
  const [error, setError] = useState<IHumanError>(void 0);
  const [success, setSuccess] = useState<boolean>(false);

  // Reset the state
  useEffect(() => {
    if (!active) {
      setLogout(false);
      setError(void 0);
      setSuccess(false);
    }
  }, [active]);

  // Handle logout logic
  useEffect(() => {
    if (!logout) return;

    const { token, cancel } = cancelTokenSource();

    // tslint:disable-next-line:no-floating-promises
    (async () => {
      try {
        await authLogout(token);

        setSuccess(true);
        setTimeout(() => {
          // The token cancels on un-mount
          if (!token.reason) {
            onActive(false);
          }
        }, 1600);
      } catch (err) {
        setError(err);
      }
    })();

    return cancel;
  }, [logout]);

  return (
    <Portal>
      <Modal active={active} scrollLock noHeader>
        <div className={styles.logout}>
          <div className={styles.content}>
            <h2>
              <IconMargin type="logout" marginRight /> Are you sure?
            </h2>
            <p className={styles.paragraph}>
              You will lose access to all of your film authorisations.
              <br />
              Any active downloads will stay unaffected.
            </p>
          </div>
          <div className={styles.actions}>
            <Button className={styles.button} disabled={logout} onClick={() => onActive(false)}>
              Cancel
            </Button>
            <Button type="danger" className={styles.button} loading={logout} onClick={() => setLogout(true)}>
              Logout
            </Button>
          </div>

          <div className={classnames(styles.successOverlay, { [styles.active]: success })}>
            <AnimatedCheck size={32} active={success} />
            <br />
            You have been logged out
          </div>
        </div>

        {error && (
          <Error
            error={error}
            onClose={() => {
              setError(void 0);
              onActive(false);
            }}
          />
        )}
      </Modal>
    </Portal>
  );
};

/** Display an error modal, with instructions on manually ending the session */
const Error: FunctionComponent<{ error: IHumanError; onClose: () => void }> = ({ error, onClose }) => (
  <div className={styles.logout}>
    <div className={styles.content}>
      <h5 className={styles.error}>
        <AnimatedCheck failed active={!!error} />
        <br />
        Your session could not be securely ended
      </h5>
      {error.text && (
        <div className={styles.errorDetails}>
          {error.icon && (
            <>
              <Icon type={error.icon} />
              <br />
            </>
          )}
          {error.text}
          {error.code && (
            <>
              <br />
              <code>{error.code}</code>)
            </>
          )}
        </div>
      )}
      <p>
        We were unable to log you out. To manually log out, you must clear your cookies for the{" "}
        <code>api.mastermovies.uk</code> domain and close any pages running the Glacier app.
      </p>
      <p>
        This device's session will expire <LogoutDuration />.
      </p>
    </div>

    <div className={styles.actions}>
      <Button type="primary" onClick={onClose}>
        OK
      </Button>
    </div>
  </div>
);

/** Display a handy time-to-logout countdown */
const LogoutDuration: FunctionComponent = () => {
  const [expiry, setExpiry] = useState<Moment>(void 0);
  const [text, setText] = useState<JSX.Element>(<i>checking...</i>);

  /* Retrieve JWT payload */
  useEffect(() => {
    const { token, cancel } = cancelTokenSource();

    // tslint:disable-next-line:no-floating-promises
    (async () => {
      try {
        const payload = await getAuthPayload(token);
        setExpiry(moment.unix(payload.exp));
      } catch (_err) {
        setText(<i>unknown</i>);
      }
    })();

    return cancel;
  }, []);

  useEffect(() => {
    if (!expiry) return;

    const interval = setInterval(() => {
      setText(
        <Tooltip overlay={expiry.toString()}>
          <b>{expiry.fromNow()}</b>
        </Tooltip>
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry]);

  return text;
};
