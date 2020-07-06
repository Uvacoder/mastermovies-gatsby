import classnames from "classnames";
import React, { useContext } from "react";
import { ThemeContext } from "../../../../hooks/theme";
import styles from "./menu.module.css";

export const NavMenu: React.FC<{ active?: boolean } & JSX.IntrinsicElements["div"]> = ({ active, ...rest }) => {
  const theme = useContext(ThemeContext);

  return (
    <div {...rest}>
      <button className={classnames(styles.hamburger, { [styles.dark]: theme === "dark", [styles.active]: active })}>
        <span className={styles.hamburgerBox}>
          <span className={styles.hamburgerInner} />
        </span>
      </button>
    </div>
  );
};
