import classnames from "classnames";
import React, { FunctionComponent, useEffect, useState } from "react";

import styles from "./divider.module.css";

export const ContactCardDivider: FunctionComponent = () => {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);

  return (
    <div
      className={classnames(styles.divider, styles.stagger, {
        [styles.show]: show,
      })}
      style={{ transitionDelay: "0.5s" }}
    >
      <div className={styles.text}>OR</div>
    </div>
  );
};
