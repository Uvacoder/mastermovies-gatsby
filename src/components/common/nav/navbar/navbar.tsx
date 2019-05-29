import classnames from "classnames";
import hash from "hash-sum";
import React, { FunctionComponent } from "react";

import { ILogo } from "..";
import { SmartLink } from "../../smart_link";
import { NavMenu } from "../common/menu";
import { INavPropsWithState } from "../nav";
import styles from "./navbar.module.css";

export const Navbar: FunctionComponent<INavPropsWithState> = ({
  links,
  theme,
  logo,
  type,
  extended,
  background,
  sidebarOpen,
  setSidebarOpen,
}) => {
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
      <NavMenu
        active={sidebarOpen}
        theme={theme}
        className={classnames(styles.menu, { [styles.exit]: sidebarOpen })}
        onClick={() => setSidebarOpen(true)}
      />

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

function isILogo(obj: any): obj is ILogo {
  return (
    typeof obj === "object" &&
    typeof obj.text === "string" &&
    typeof obj.link === "string"
  );
}
