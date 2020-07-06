import { graphql, useStaticQuery } from "gatsby";
import Img from "gatsby-image/withIEPolyfill";
import React from "react";
import { Fade } from "react-reveal";
import { MasterMoviesLogo } from "../../../components/common/logos/mastermovies";
import styles from "./banner.module.css";

export const IndexBanner: React.FC = () => {
  const query = useStaticQuery(graphql`
    query {
      background: file(relativePath: { eq: "index/landing_banner.jpg" }) {
        childImageSharp {
          sqip(mode: 1, numberOfPrimitives: 16, blur: 0) {
            dataURI
          }
          fluid(maxWidth: 1920, quality: 90) {
            ...GatsbyImageSharpFluid_withWebp_noBase64
          }
        }
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
      <Fade delay={100} ssrReveal>
        <div className={styles.container}>
          <MasterMoviesLogo width="128px" fill="#fff" />
          <h1 className={styles.title}>MASTERMOVIES</h1>
          <h2 className={styles.subtitle}>SMALL MEDIA STUDIO</h2>
        </div>
      </Fade>
    </div>
  );
};
