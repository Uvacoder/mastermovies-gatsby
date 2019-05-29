import classnames from "classnames";
import React, { FunctionComponent, useEffect, useState } from "react";

import styles from "./menu.module.css";

type divProps = JSX.IntrinsicElements["div"];
interface INavMenuProps extends divProps {
  /** Whether in an open or close state */
  active: boolean;
  /** Delay before the animation begins */
  delay?: number;
  /** Light or dark theme */
  theme?: "dark" | "light";
}

export const NavMenu: FunctionComponent<INavMenuProps> = ({
  active,
  theme = "light",
  delay = 0,
  className,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(active);
  const [isTheme, setIsTheme] = useState(theme);

  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(() => {
        setIsActive(active);
        setIsTheme(theme);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      setIsActive(active);
      setIsTheme(theme);
    }
  }, [active, theme]);

  return (
    <div
      {...rest}
      className={classnames(styles.root, className)}
      data-light={isTheme === "light" ? "" : void 0}
      data-active={isActive ? "" : void 0}
    >
      <button className={styles.hamburger} type="button">
        <span className={styles.hamburgerBox}>
          <span className={styles.hamburgerInner} />
        </span>
      </button>
    </div>
  );
};
