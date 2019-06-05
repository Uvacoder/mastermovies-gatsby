import { Icon } from "antd";
import classnames from "classnames";
import React, { CSSProperties, FunctionComponent } from "react";

import styles from "./spinner.module.css";

interface ISpinnerProps {
  active?: boolean;
  delay?: number;
  theme?: "light" | "dark";
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export const Spinner: FunctionComponent<ISpinnerProps> = ({
  active = false,
  delay = 0,
  theme = "light",
  size = 18,
  className,
  style,
}) => {
  if (active !== true) return null;

  return (
    <Icon
      type="loading"
      className={classnames(
        styles.spinner,
        { [styles.dark]: theme === "dark" },
        className
      )}
      style={{ fontSize: size, animationDelay: `${delay}ms`, ...style }}
    />
  );
};
