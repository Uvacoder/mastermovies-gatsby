import classnames from "classnames";
import React, { useContext } from "react";
import { ThemeContext } from "../../../hooks/theme";
import styles from "./mastermovies.module.css";

export const MasterMoviesLogo: React.FC<JSX.IntrinsicElements["svg"]> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40.02" {...props}>
    <polygon points="0 40 44 40 22 0" />
    <polygon points="48 40 64 40 44 8 36.4 20" />
  </svg>
);

export const MasterMoviesThemedLogo: React.FC<JSX.IntrinsicElements["svg"]> = ({ style, ...rest }) => (
  <MasterMoviesLogo style={{ fill: useContext(ThemeContext) === "dark" ? "#fff" : "#000", ...style }} {...rest} />
);

const TextBase: React.FC<{ text: string } & JSX.IntrinsicElements["span"]> = ({ text, className, ...rest }) => {
  const theme = useContext(ThemeContext);
  return (
    <span
      className={classnames(styles.logo, { [styles.dark]: theme === "dark" }, className)}
      {...rest}
      children={text}
    />
  );
};

export const MasterMoviesText: React.FC<JSX.IntrinsicElements["span"]> = ({ className, ...rest }) => (
  <TextBase text="MasterMovies" className={classnames(styles.mastermovies, className)} {...rest} />
);

export const GlacierText: React.FC<JSX.IntrinsicElements["span"]> = ({ className, ...rest }) => (
  <TextBase text="Glacier" className={classnames(styles.glacier, className)} {...rest} />
);
