import { graphql, useStaticQuery } from "gatsby";
import React, { FunctionComponent } from "react";

import { MasterMoviesLogo } from "../../../../../../components/common/mastermovies_logo";
import { GlacierLogo } from "../../../../../../components/glacier/glacier_logo";
import styles from "./about.module.css";
import { MasterMoviesIDLogo } from "../../../../../../components/glacier/mastermovies_id";

export const GlacierActionsAbout: FunctionComponent =  () => {

  const query = useStaticQuery(graphql`
    query {
      logo: file(relativePath: { eq: "logo/black.svg" }) {
        publicURL
      }
    }
  `);

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img className={styles.logo} src={query.logo.publicURL} />
          <GlacierLogo />
        </div>
        <div className={styles.subheading}>
          Film Database
        </div>

        <h3>What is <GlacierLogo />?</h3>
        <p>
          <GlacierLogo /> is a secure film archive/distribution service for films
          produced by <MasterMoviesLogo />.
          <br/>
          It is powered by SnowOwl, <MasterMoviesLogo />' virtual private server based in Germany,
          built with using some of today's leading web technologies such as Node.js.
        </p>

        <h3>Why are some films restricted?</h3>
        <p>
          For the protection of its participants, some films are restricted to a certain audience.
          These films require an additional authorisation step to prove that the user is permitted
          to access the resource.
        </p>
        <p>
          Download keys provide a simple way to share access to films and must be obtained from
          the film producer.
        </p>
      </div>
    );

}