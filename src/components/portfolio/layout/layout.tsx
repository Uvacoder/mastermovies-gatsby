import React, { FunctionComponent } from "react";

import { ThemeContext } from "../../../hooks/theme";
import styles from "./layout.module.css";

export const PortfolioLayout: FunctionComponent = ({ children }) => (
  <ThemeContext.Provider value="dark">
    <div className={styles.portfolio} children={children} />
  </ThemeContext.Provider>
);
