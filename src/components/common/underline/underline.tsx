import classnames from "classnames";
import React, { FunctionComponent, useContext } from "react";

import { ThemeContext } from "../../../hooks/theme";
import { IStyleProps } from "../../../types/component";
import styles from "./underline.module.css";

interface IUnderlineProps {
  animated?: boolean;
  thin?: boolean;
}

export const Underline: FunctionComponent<IUnderlineProps & IStyleProps> = ({
  animated,
  thin,
  className,
  children,
  ...rest
}) => {
  const theme = useContext(ThemeContext);

  return (
    <div
      {...rest}
      className={classnames(
        styles.underline,
        { [styles.dark]: theme === "dark", [styles.thin]: thin, [styles.animated]: animated },
        className
      )}
    >
      {children}
    </div>
  );
};
