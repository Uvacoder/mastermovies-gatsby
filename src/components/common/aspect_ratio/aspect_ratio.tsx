import classnames from "classnames";
import React, { FunctionComponent } from "react";

import { IStyleProps } from "../../../types/component";
import styles from "./aspect_ratio.module.css";

interface IAspectRatioProps extends IStyleProps {
  /** The ratio to enforce */
  ratio?: number;
}

/** Enforces the height to match an aspect ratio. To be used inside size-restricted wrapper. */
export const AspectRatio: FunctionComponent<IAspectRatioProps> = ({ ratio = 1, style, className, children }) => (
  <div style={{ paddingTop: `${100 / ratio}%`, ...style }} className={classnames(styles.aspectRatio, className)}>
    <div className={styles.aspectRatioContainer}>{children}</div>
  </div>
);
