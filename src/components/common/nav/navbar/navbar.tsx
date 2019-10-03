import classnames from "classnames";
import hash from "hash-sum";
import React, { FunctionComponent, useContext } from "react";

import { ThemeContext } from "../../../../hooks/theme";
import { SmartLink } from "../../smart_link";
import { INavProps } from "../nav";
import styles from "./navbar.module.css";

export const Navbar: FunctionComponent<INavProps> = ({ links, logo, type, extended, background }) => {
  const theme = useContext(ThemeContext);

  return (
    <nav
      className={classnames(styles.nav, {
        [styles.dark]: theme === "dark",
        [styles.extended]: extended,
        [styles.background]: background,
        [styles.fixed]: type === "fixed",
        [styles.absolute]: type === "absolute",
      })}
    >
      <SmartLink className={styles.logo} link={logo.link}>
        {logo.text}
      </SmartLink>

      <div className={styles.grow} />

      {links.map(link => (
        <SmartLink key={hash(link)} link={link.link} className={styles.link}>
          {link.text}
        </SmartLink>
      ))}
    </nav>
  );
};
