import classnames from "classnames";
import hash from "hash-sum";
import React, { FunctionComponent, ReactNode } from "react";

import { ILogo, INavProps } from "..";
import styles from "./navbar.module.css";
import { SmartLink } from "../../smart_link";


export const Navbar: FunctionComponent<INavProps> = ({
  links,
  theme,
  logo,
  type,
  extended,
  background
}) => {

  return (
    <nav
      className={classnames(styles.nav, {
        [styles.dark]: theme === "dark",
        [styles.extended]: extended,
        [styles.background]: background,
        [styles.fixed]: type === "fixed",
        [styles.absolute]: type === "absolute"
      })}>

      <SmartLink className={styles.logo} link={logo.link}>
        {logo.text}
      </SmartLink>

      <div className={styles.grow} />

      { links.map(link => <SmartLink key={hash(link)} link={link.link} className={styles.link}>{link.text}</SmartLink>) }

    </nav>
  );

}

function isILogo(obj: any): obj is ILogo {
  return typeof obj === "object" && typeof obj.text === "string" && typeof obj.link === "string";
}
