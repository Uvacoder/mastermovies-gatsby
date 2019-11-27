import classnames from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./design.module.css";

type TPolygon = FunctionComponent<JSX.IntrinsicElements["polygon"]>;

export const PortfolioDesignLeftSlant: TPolygon = props => <polygon points="0 64, 256 0, 256 192, 0 256" {...props} />;
export const PortfolioDesignRightSlant: TPolygon = props => <polygon points="0 0, 256 64, 256 256, 0 192" {...props} />;

/** Creates a squish-able 256x256 svg element in a container */
export const PortfolioDesignElement: FunctionComponent<JSX.IntrinsicElements["div"]> = ({
  className,
  children,
  ...rest
}) => (
  <div className={classnames(styles.container, className)} {...rest}>
    <svg viewBox="0 0 256 256" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
      {children}
    </svg>
  </div>
);
