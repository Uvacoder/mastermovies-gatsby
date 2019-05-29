import React, { FunctionComponent } from "react";
import styles from "./error.module.css";
import { Icon, Button } from "antd";

type divProps = JSX.IntrinsicElements["div"];
interface IGlacierErrorProps extends divProps {
  onRetry?: () => any;
}

export const GlacierError: FunctionComponent<IGlacierErrorProps> = ({
  onRetry,
  ...rest
}) => (
  <div {...rest} className={styles.root}>
    <Icon type="api" className={styles.icon} />
    <span className={styles.text}>
      There was a problem connecting to Glacier.
    </span>
    <Button onClick={onRetry}>Retry</Button>
  </div>
);
