import { graphql, useStaticQuery } from "gatsby";
import Image from "gatsby-image/withIEPolyfill";
import React, { FunctionComponent } from "react";

import { AnimatedStyle } from "../../../../components/common/animated_style";
import styles from "./background.module.css";

export const GlacierBackground: FunctionComponent<{ active: boolean }> = ({ active }) => {
  const query = useStaticQuery(graphql`
    query {
      background: file(relativePath: { eq: "glacier/background.jpg" }) {
        childImageSharp {
          sqip(mode: 1, numberOfPrimitives: 16, blur: 0) {
            dataURI
          }
          fluid(maxWidth: 1920, quality: 75) {
            ...GatsbyImageSharpFluid_withWebp_noBase64
          }
        }
      }
    }
  `);

  return (
    <AnimatedStyle to={{ opacity: active ? 1 : 0 }} speed={0.2} dampingRatio={4}>
      <div className={styles.background}>
        <Image
          className={styles.image}
          fluid={{
            ...query.background.childImageSharp.fluid,
            base64: query.background.childImageSharp.sqip.dataURI,
          }}
        />
      </div>
    </AnimatedStyle>
  );
};
