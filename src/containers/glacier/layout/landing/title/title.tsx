import classnames from "classnames";
import React, { FunctionComponent } from "react";

import { Underline } from "../../../../../components/common/underline";
import { IStyleProps } from "../../../../../types/component";
import styles from "./title.module.css";

export const GlacierTitle: FunctionComponent<IStyleProps> = ({ className, children, ...rest }) => (
  <div {...rest} className={classnames(styles.titleContainer, className)}>
    <Underline className={styles.title} animated children={children} />
  </div>
);

export const GlacierSubTitle: FunctionComponent = ({ children }) => (
  <div className={styles.titleContainer}>
    <div className={styles.subtitle}>{children}</div>
  </div>
);
