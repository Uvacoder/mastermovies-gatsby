import { graphql, useStaticQuery } from "gatsby";
import Img from "gatsby-image/withIEPolyfill";
import React, { FunctionComponent } from "react";

import styles from "./banner.module.css";

export const IndexBanner: FunctionComponent = () => {

  const query = useStaticQuery(graphql`
    query {
      background: file(relativePath: { eq: "landing_banner.jpg" }) {
        childImageSharp {
          sqip(mode: 1, numberOfPrimitives: 16, blur: 0) {
            dataURI
          }
          fluid(maxWidth: 1920, quality: 90) {
            ...GatsbyImageSharpFluid_withWebp_noBase64
          }
        }
      }
      logoImage: file(relativePath: { eq: "logo/white.svg" }) {
        publicURL
      }
    }
  `);

  return (
    <div className={styles.root}>
      <Img
        objectFit="cover"
        fluid={{
          ...query.background.childImageSharp.fluid,
          base64: query.background.childImageSharp.sqip.dataURI,
        }}
        className={styles.background}
      />
      <div className={styles.container}>
        <img className={styles.logo} src={query.logoImage.publicURL} />
        <h1 className={styles.title}>MASTERMOVIES</h1>
        <h2 className={styles.subtitle}>SMALL MEDIA STUDIO</h2>
      </div>
    </div>
  );
};
