import { Icon } from "antd";
import classnames from "classnames";
import React, { CSSProperties, FunctionComponent, useContext } from "react";

import styles from "./spinner.module.css";
import { ThemeContext } from "../../../hooks/theme";

interface ISpinnerProps {
  active?: boolean;
  delay?: number;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export const Spinner: FunctionComponent<ISpinnerProps> = ({
  active = false,
  delay = 0,
  size = 18,
  className,
  style,
}) => {
  const theme = useContext(ThemeContext);

  if (!active) return null;

  return (
    <Icon
      type="loading"
      className={classnames(styles.spinner, { [styles.dark]: theme === "dark" }, className)}
      style={{ fontSize: size, animationDelay: `${delay}ms`, ...style }}
    />
  );
};
