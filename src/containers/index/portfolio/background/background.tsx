import { graphql, useStaticQuery } from "gatsby";
import Img from "gatsby-image/withIEPolyfill";
import React, { FunctionComponent } from "react";

import { IGraphQLImage } from "../../../../types/graphql";
import styles from "./background.module.css";

export const IndexPortfolioBackground: FunctionComponent = () => {
  const { background } = useStaticQuery<{ background: IGraphQLImage }>(
    graphql`
      query {
        background: file(relativePath: { eq: "index/portfolio.jpg" }) {
          childImageSharp {
            sqip(mode: 1, numberOfPrimitives: 16, blur: 0) {
              dataURI
            }
            fluid(maxWidth: 800, quality: 70) {
              ...GatsbyImageSharpFluid_withWebp_noBase64
            }
          }
        }
      }
    `
  );

  return (
    <Img
      objectFit="cover"
      fluid={{
        ...background.childImageSharp.fluid,
        base64: background.childImageSharp.sqip.dataURI,
      }}
      className={styles.image}
    />
  );
};
