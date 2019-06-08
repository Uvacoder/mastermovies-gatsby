import { Icon, Tooltip } from "antd";
import classnames from "classnames";
import React, { FunctionComponent } from "react";

import { footerLinks, socialLinks } from "../../../config";
import { SmartLink } from "../smart_link";
import styles from "./footer.module.css";

type divProps = JSX.IntrinsicElements["div"];
interface IFooterProps extends divProps {
  theme?: "light" | "dark";
}

export const Footer: FunctionComponent<IFooterProps> = ({
  theme = "light",
  ...rest
}) => {
  return (
    <footer
      {...rest}
      className={styles.root}
      data-dark={theme === "dark" ? "" : void 0}
    >
      <div className={styles.title}>MasterMovies</div>
      <div className={styles.subtitle}>A small media company</div>

      <p>
        {footerLinks.map(link => (
          <SmartLink key={link.text} className={styles.link} link={link.link}>
            {link.text}
          </SmartLink>
        ))}
      </p>

      <p>
        {socialLinks.map(link => (
          <a key={link.text} href={link.link}>
            <Tooltip title={link.text} placement="bottom">
              <Icon
                type={link.icon}
                className={classnames(styles.icon, styles.link)}
              />
            </Tooltip>
          </a>
        ))}
      </p>

      <p className={styles.breadcrumb}>
        <span className={styles.breadcrumbMessage}>
          All rights reserved © 2019 Marcus Cemes – Powered by <b>SnowOwl</b>
        </span>
      </p>
    </footer>
  );
};
