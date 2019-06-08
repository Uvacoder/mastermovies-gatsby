import classnames from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./glacier_logo.module.css";

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
    className={classnames(styles.logo, {
      [styles.dark]: theme === "dark",
    }, className)}
  >
    Glacier
  </span>
);
