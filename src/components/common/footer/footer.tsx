import { Icon, Tooltip } from "antd";
import classnames from "classnames";
import { Link } from "gatsby";
import React, { FunctionComponent } from "react";

import styles from "./footer.module.css";
import { socialLinks, links } from "../../../config";

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
        {links.map(link => (
          <Link key={link.text} className={styles.link} to={link.link}>
            {link.text}
          </Link>
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
        <span className={styles.experimental}>
          <Icon type="experiment" className={styles.experimentalIcon} />
          This website is currently under active development
        </span>
        {/* <span className={styles.breadcrumbMessage}>
          Home-made website, coded with ❤
        </span> */}
        <span className={styles.breadcrumbMessage}>
          All rights reserved © 2019 Marcus Cemes – Powered by <b>SnowOwl</b>
        </span>
      </p>
    </footer>
  );
};
