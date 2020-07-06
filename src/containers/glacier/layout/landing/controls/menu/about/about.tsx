import { Link } from "gatsby";
import React from "react";
import { GlacierText } from "../../../../../../../components/common/logos";
import { MasterMoviesLogo } from "../../../../../../../components/common/logos/mastermovies";
import { Modal } from "../../../../../../../components/common/modal";
import { Portal } from "../../../../../../../components/common/portal";
import styles from "./about.module.css";

export const GlacierMenuAbout: React.FC<{
  active?: boolean;
  onActive: (active: boolean) => void;
}> = ({ active, onActive }) => (
  <Portal>
    <Modal active={active} onBack={() => onActive(false)} backText="Back to Glacier">
      <div className={styles.container}>
        <div className={styles.header}>
          <MasterMoviesLogo className={styles.logo} />
          <GlacierText />
        </div>
        <div className={styles.subheading}>Film Database</div>

        <p>
          Glacier is a web app integrated as part of the MasterMovies website. It provides secure access to high-quality
          digital exports of MasterMovies films that would otherwise not be available (at the same quality) on other
          platforms.
        </p>

        <p>
          Glacier is securely hosted on SnowOwl, the primary backend providing many of MasterMovies' services. The
          source code is available publicly on <Link to="https://github.com/MarcusCemes/mastermovies">GitHub</Link>. The
          backend Restful-based API is powered by Nginx, Node.js and Postgres, using JSON Web Tokens for secure session
          exchange and download authorisation.
        </p>
        <p className={styles.copyrightNotice}>Copyright © {Math.min(2020, new Date().getFullYear())} Marcus Cemes</p>
      </div>
    </Modal>
  </Portal>
);
