import { graphql, useStaticQuery } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import React, { FunctionComponent } from "react";

import styles from "./sidebar_image.module.css";

export const SidebarImage: FunctionComponent<{ load?: boolean }> = React.memo(
  ({ load = true }) => {
    const { background } = useStaticQuery(
      graphql`
        query {
          background: file(relativePath: { eq: "sidebar.jpg" }) {
            childImageSharp {
              sqip(mode: 1, numberOfPrimitives: 16, blur: 0) {
                dataURI
              }
              fluid(maxHeight: 864) {
                ...GatsbyImageSharpFluid_withWebp_noBase64
              }
            }
          }
        }
      `
    );

    // Only provide the base64 if loading is disabled
    const fluid: FluidObject = load
      ? { ...background.childImageSharp.fluid }
      : {
          aspectRatio: 1,
          src: "",
          srcSet: "",
          srcWebp: "",
          srcSetWebp: "",
          sizes: "",
        };
    fluid.base64 = background.childImageSharp.sqip.dataURI;

    return (
      <div className={styles.container}>
        <Img className={styles.image} fluid={fluid} />
      </div>
    );
  }
);
