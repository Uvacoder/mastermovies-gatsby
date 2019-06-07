import { Button, message } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";

import { logout } from "../../../../../../api/auth";
import { createCancelToken } from "../../../../../../api/common";
import styles from "./logout.module.css";

interface IGlacierActionsLogoutProps {
  onBack?: () => any;
}

export const GlacierActionsLogout: FunctionComponent<IGlacierActionsLogoutProps> = ({
  onBack = () => {}
}) => {

  const [ action, setAction ] = useState<boolean>(false);
  const [ success, setSuccess ] = useState<boolean>(false);

  // Logout logic
  useEffect(() => {
    if (action) {
      let mounted = true;
      const cancelToken = createCancelToken();
      logout(cancelToken.token)
        .then(() => {
          if (mounted) {
            setSuccess(true);
            setAction(false);
            message.success("You have been logged out", 2);
          }
        })
        .catch(err => {
          if (mounted) {
            setAction(false);
            setTimeout(() => message.error("Could not log you out: " + err.message, 3), 400);
          }
        });
      return () => {
        mounted = false;
        cancelToken.cancel();
      }
    } else if (success) {
      const timeout1 = setTimeout(() => onBack(), 500);
      const timeout2 = setTimeout(() => setSuccess(false), 1000);
      return () => { clearTimeout(timeout1); clearTimeout(timeout2) };
    }
  }, [ action ]);

  return (
    <div className={styles.logout}>
      <h3>Are you sure you want to end your session?</h3>
      <p>
        You will lose access to the films your have unlocked
        and any running downloads may be interrupted.
      </p>

      <div className={styles.actions}>
        <Button className={styles.button} disabled={action || success} onClick={() => onBack()}>Cancel</Button>
        <Button
          className={styles.button}
          type="primary"
          icon={success? "check" : "meh"}
          loading={action}
          disabled={action || success}
          onClick={() => setAction(true)}
        >Forget me</Button>
      </div>
    </div>
  );
}