import classnames from "classnames";
import React from "react";

import { Underline } from "../../../../../components/common/underline";
import { IStyleProps } from "../../../../../types/component";
import styles from "./title.module.css";

export const GlacierTitle: React.FC<IStyleProps> = ({ className, children, ...rest }) => (
  <div {...rest} className={classnames(styles.titleContainer, className)}>
    <Underline className={styles.title} animated children={children} />
  </div>
);

export const GlacierSubTitle: React.FC = ({ children }) => (
  <div className={styles.titleContainer}>
    <div className={styles.subtitle}>{children}</div>
  </div>
);
