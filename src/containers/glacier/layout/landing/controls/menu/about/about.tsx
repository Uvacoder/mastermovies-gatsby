import { graphql, Link, useStaticQuery } from "gatsby";
import React, { FunctionComponent } from "react";

import { GlacierLogo } from "../../../../../../../components/common/logos";
import { Modal } from "../../../../../../../components/common/modal";
import { Portal } from "../../../../../../../components/common/portal";
import styles from "./about.module.css";

export const GlacierMenuAbout: FunctionComponent<{
  active?: boolean;
  onActive: (active: boolean) => void;
}> = ({ active, onActive }) => {
  const query = useStaticQuery(graphql`
    query {
      logo: file(relativePath: { eq: "logo/black.svg" }) {
        publicURL
      }
    }
  `);

  return (
    <Portal>
      <Modal active={active} onBack={() => onActive(false)} backText="Back to Glacier">
        <div className={styles.container}>
          <div className={styles.header}>
            <img className={styles.logo} src={query.logo.publicURL} />
            <GlacierLogo />
          </div>
          <div className={styles.subheading}>Film Database</div>

          <p>
            Glacier is a web app integrated as part of the MasterMovies website. It provides secure access to
            high-quality digital exports of MasterMovies films that would otherwise not be available (at the same
            quality) on other platforms.
          </p>

          <p>
            Glacier is securely hosted on SnowOwl, the primary backend providing many of MasterMovies' services. The
            source code is available publicly on <Link to="https://github.com/MarcusCemes/mastermovies">GitHub</Link>.
            The backend Restful-based API is powered by Nginx, Node.js and Postgres, using JSON Web Tokens for secure
            session exchange and download authorisation.
          </p>
          <p className={styles.copyrightNotice}>Copyright © 2019 Marcus Cemes</p>
        </div>
      </Modal>
    </Portal>
  );
};
