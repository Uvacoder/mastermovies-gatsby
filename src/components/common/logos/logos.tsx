import classnames from "classnames";
import React, { FunctionComponent, useContext } from "react";
import { ThemeContext } from "../../../hooks/theme";

import styles from "./logos.module.css";

type spanProps = JSX.IntrinsicElements["span"];

const BasicLogo: FunctionComponent<{ text: string } & spanProps> = ({ text, className, ...rest }) => {
  const theme = useContext(ThemeContext);
  return (
    <span
      className={classnames(styles.logo, { [styles.dark]: theme === "dark" }, className)}
      {...rest}
      children={text}
    />
  );
};

export const MasterMoviesLogo: FunctionComponent<spanProps> = ({ className, ...rest }) => (
  <BasicLogo text="MasterMovies" className={classnames(styles.mastermovies, className)} {...rest} />
);

export const GlacierLogo: FunctionComponent<spanProps> = ({ className, ...rest }) => (
  <BasicLogo text="Glacier" className={classnames(styles.glacier, className)} {...rest} />
);
