import "./swagger-ui.css";

import React, { FunctionComponent } from "react";

import styles from "./layout.module.css";

export const DocsLayout: FunctionComponent = props => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>{props.children}</div>
    </div>
  );
};
