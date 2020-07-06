import React from "react";
import { ThemeContext } from "../../../hooks/theme";
import styles from "./layout.module.css";

export const PortfolioLayout: React.FC = ({ children }) => (
  <ThemeContext.Provider value="dark">
    <div className={styles.portfolio} children={children} />
  </ThemeContext.Provider>
);
