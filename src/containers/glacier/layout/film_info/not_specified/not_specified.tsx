import React, { FunctionComponent } from "react";

import classnames from "classnames";
import styles from "./not_specified.module.css";

/** Create an italics piece of text. Pass a `children` prop to override text */
export const GlacierNotSpecified: FunctionComponent<JSX.IntrinsicElements["i"]> = ({
  className,
  children,
  ...rest
}) => (
  <i {...rest} className={classnames(styles.notSpecified, className)}>
    {children || "Not Specified"}
  </i>
);
