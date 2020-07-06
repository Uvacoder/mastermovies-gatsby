import { LoadingOutlined } from "@ant-design/icons";
import classnames from "classnames";
import React, { CSSProperties, useContext } from "react";
import { ThemeContext } from "../../../hooks/theme";
import styles from "./spinner.module.css";

interface ISpinnerProps {
  active?: boolean;
  delay?: number;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export const Spinner: React.FC<ISpinnerProps> = ({ active = false, delay = 0, size = 18, className, style }) => {
  const theme = useContext(ThemeContext);

  if (!active) return null;

  return (
    <LoadingOutlined
      className={classnames(styles.spinner, { [styles.dark]: theme === "dark" }, className)}
      style={{ fontSize: size, animationDelay: `${delay}ms`, ...style }}
    />
  );
};
