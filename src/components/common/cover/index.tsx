import classnames from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./index.module.css";

/**
 * Creates an absolute zero container, and fills the image across.
 * Also protects against clicks.
 */
export const Cover: FunctionComponent<JSX.IntrinsicElements["div"]> = ({
  children,
  ...rest
}) => {
  return (
    <div {...rest} className={classnames(styles.container, rest.className)}>
      {children}
    </div>
  );
};
