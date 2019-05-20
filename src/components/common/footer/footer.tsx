import { Icon, Tooltip } from "antd";
import classnames from "classnames";
import { Link } from "gatsby";
import React, { FunctionComponent } from "react";

import styles from "./footer.module.css";

type divProps = JSX.IntrinsicElements["div"];
interface IFooterProps extends divProps {
  theme?: "light" | "dark";
}

export const Footer: FunctionComponent<IFooterProps> = ({ theme = "light", ...rest }) => {

  return (
    <footer {...rest} className={styles.root} data-dark={theme === "dark"? "" : void 0}>

      <div className={styles.title}>MasterMovies</div>
      <div className={styles.subtitle}>A small media company</div>

      <p>
        <Tooltip title="The front page">
          <Link className={styles.link} to="/">HOME</Link>
        </Tooltip>
        –
        <Tooltip title="Browse the MasterMovies film database">
          <Link className={styles.link} to="/glacier">GLACIER</Link>
        </Tooltip>
        –
        <Tooltip title="An OpenAPI v3 compliant document describing the capabilities of the MasterMovies API">
          <Link className={styles.link} to="/docs">API</Link>
        </Tooltip>
        –
        <Tooltip title="Reach out to us">
          <Link className={styles.link} to="/contact">CONTACT</Link>
        </Tooltip>
      </p>

      <p>
        <a href="https://facebook.com/MarcusCemes">
          <Tooltip title="Facebook" placement="bottom">
            <Icon type="facebook" className={classnames(styles.icon, styles.link)} />
          </Tooltip>
        </a>

        <a href="https://twitter.com/MarcusCemes">
          <Tooltip title="Twitter" placement="bottom">
            <Icon type="twitter" className={classnames(styles.icon, styles.link)} />
          </Tooltip>
        </a>

        <a href="https://instagram.com/marcus_cemes">
          <Tooltip title="Instagram" placement="bottom">
            <Icon type="instagram" className={classnames(styles.icon, styles.link)} />
          </Tooltip>
        </a>

        <a href="https://www.youtube.com/channel/UCRx9M5nYJfW9F5hsFcklwKQ">
          <Tooltip title="YouTube" placement="bottom">
            <Icon type="youtube" className={classnames(styles.icon, styles.link)} />
          </Tooltip>
        </a>

      </p>

    <p className={styles.breadcrumb}>
      <span className={styles.experimental}>
        <Icon type="experiment" className={styles.experimentalIcon} />
        This website is currently under active development
      </span>
      <span className={styles.breadcrumbMessage}>
        Home-made website, coded with ❤
      </span>
    </p>



    </footer>
  );
}