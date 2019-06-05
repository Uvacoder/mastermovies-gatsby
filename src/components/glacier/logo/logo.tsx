import React, { FunctionComponent } from "react";
import classnames from "classnames";
import styles from "./logo.module.css";

type spanProps = JSX.IntrinsicElements["span"];
interface IGlacierLogoProps extends spanProps {
  theme?: "light" | "dark";
}

export const GlacierLogo: FunctionComponent<IGlacierLogoProps> = ({
  theme = "light",
  className,
  ...rest
}) => (
  <span
    {...rest}
    className={classnames(styles.logo, className, {
      [styles.dark]: theme === "dark",
    })}
  >
    Glacier
  </span>
);
