import React, { FunctionComponent, useState, useEffect } from "react";
import styles from "./logout.module.css";
import { Button, Row, message, Icon } from "antd";
import { createCancelToken } from "../../../../../../api/common";
import { logout } from "../../../../../../api/auth";

interface IGlacierActionsLogoutProps {
  onBack?: () => any;
}

export const GlacierActionsLogout: FunctionComponent<IGlacierActionsLogoutProps> = ({
  onBack = () => {}
}) => {

  const [ action, setAction ] = useState<boolean>(false);

  // Logout logic
  useEffect(() => {
    if (action) {
      let mounted = true;
      const cancelToken = createCancelToken();
      logout(cancelToken.token)
        .then(() => {
          if (mounted) {
            setAction(false);
            onBack();
            setTimeout(() => message.success("You have been logged out", 2), 400);
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
    }
  }, [ action ]);

  return (
    <div className={styles.logout}>
      <h3>Are you sure you want to logout?</h3>
      <p>You may will lose access to any unlocked films and any
        running downloads may be interrupted.
      </p>

      <div className={styles.actions}>
        <Button className={styles.button} disabled={action} onClick={() => onBack()}>Cancel</Button>
        <Button className={styles.button} type="primary" icon="meh" loading={action} onClick={() => setAction(true)}>Forget me</Button>
      </div>
    </div>
  );
}