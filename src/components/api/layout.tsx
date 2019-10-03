import React, { FunctionComponent } from "react";

import styles from "./layout.module.css";

export const ApiLayout: FunctionComponent = props => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>{props.children}</div>
    </div>
  );
};
