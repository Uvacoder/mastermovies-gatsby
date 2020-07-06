import { Empty } from "antd";
import classnames from "classnames";
import React, { useContext } from "react";
import { ThemeContext } from "../../../hooks/theme";
import styles from "./nothing.module.css";

/** Displays a generic `Nothing to show here` message */
export const Nothing: React.FC = () => {
  const theme = useContext(ThemeContext);

  return (
    <div className={classnames(styles.nothing, { [styles.dark]: theme === "dark" })}>
      <Empty description="Nothing to show here..." image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
  );
};
