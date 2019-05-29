import { graphql, useStaticQuery } from "gatsby";
import Img from "gatsby-image";
import React from "react";

import styles from "./background.module.css";

export const ContactBackground = React.memo(() => {
  const { background } = useStaticQuery(graphql`
    query {
      background: file(relativePath: { eq: "contact/background.jpg" }) {
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
    <div className={styles.container}>
      <Img
        className={styles.image}
        fluid={{
          ...background.childImageSharp.fluid,
          base64: background.childImageSharp.sqip.dataURI,
        }}
      />
    </div>
  );
});
