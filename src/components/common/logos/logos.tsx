import classnames from "classnames";
import React, { FunctionComponent, useContext } from "react";
import { ThemeContext } from "../../../hooks/theme";

import styles from "./logos.module.css";

const BasicLogo: FunctionComponent<{ text: string; className: string }> = ({ text, className }) => {
  const theme = useContext(ThemeContext);
  return <span className={classnames(styles.logo, { [styles.dark]: theme === "dark" }, className)}>{text}</span>;
};

export const MasterMoviesLogo: FunctionComponent = () => (
  <BasicLogo text="MasterMovies" className={styles.mastermovies} />
);

export const GlacierLogo: FunctionComponent = () => <BasicLogo text="Glacier" className={styles.glacier} />;
