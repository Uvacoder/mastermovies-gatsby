import classnames from "classnames";
import React, { CSSProperties, useContext } from "react";
import { ThemeContext } from "../../../hooks/theme";
import styles from "./skeleton.module.css";

interface ISkeletonProps {
  /** Override CSS styles */
  style?: CSSProperties;
  /** A classname to apply to the <div /> element */
  className?: string;
  /** Use a lighter shade */
  light?: boolean;
  /** Use an even lighter shade */
  lighter?: boolean;
  /** Create a shorter last line */
  shorter?: boolean;
  /** The number of lines to create */
  count?: number;
}

/** Provides a generic skeleton for loading text */
export const Skeleton: React.FC<ISkeletonProps> = ({
  style,
  className,
  light = false,
  lighter = false,
  shorter = false,
  count = 1,
}) => {
  const theme = useContext(ThemeContext);

  const elements = [];

  for (let i = 0; i < count; i++) {
    elements.push(
      <span
        key={i}
        style={style}
        className={classnames(
          styles.skeleton,
          {
            [styles.light]: light,
            [styles.lighter]: lighter,
            [styles.dark]: theme === "dark",
            [styles.shorter]: shorter && i === count - 1,
          },
          className
        )}
      />
    );
  }

  return <>{elements}</>;
};
