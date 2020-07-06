import classnames from "classnames";
import { graphql, useStaticQuery } from "gatsby";
import { FluidObject } from "gatsby-image";
import Img from "gatsby-image/withIEPolyfill";
import React from "react";

import { PrettyLink } from "../../../components/common/link";
import { Brand500px } from "../../../images/icons/500px";
import { IGraphQLImage } from "../../../types/graphql";
import styles from "./gallery.module.css";

interface IQuery {
  top: IGraphQLImage;
  middle: IGraphQLImage;
  bottom: IGraphQLImage;
}

// TODO improve

export const PortfolioPhotoGallery: React.FC<JSX.IntrinsicElements["div"]> = (props) => {
  const { top, middle, bottom } = useStaticQuery<IQuery>(graphql`
    query {
      top: file(relativePath: { eq: "portfolio/paris_seine.jpg" }) {
        childImageSharp {
          sqip(mode: 1, numberOfPrimitives: 16, blur: 0) {
            dataURI
          }
          fluid(maxWidth: 960, quality: 70) {
            ...GatsbyImageSharpFluid_withWebp_noBase64
          }
        }
      }
      middle: file(relativePath: { eq: "portfolio/snowman.jpg" }) {
        childImageSharp {
          sqip(mode: 1, numberOfPrimitives: 16, blur: 0) {
            dataURI
          }
          fluid(maxWidth: 960, quality: 70) {
            ...GatsbyImageSharpFluid_withWebp_noBase64
          }
        }
      }
      bottom: file(relativePath: { eq: "portfolio/ireland_sea.jpg" }) {
        childImageSharp {
          sqip(mode: 1, numberOfPrimitives: 16, blur: 0) {
            dataURI
          }
          fluid(maxWidth: 960, quality: 70) {
            ...GatsbyImageSharpFluid_withWebp_noBase64
          }
        }
      }
    }
  `);

  return (
    <div {...props}>
      <Picture
        className={styles.bottom}
        fluid={{
          ...bottom.childImageSharp.fluid,
          base64: bottom.childImageSharp.sqip.dataURI,
        }}
      />
      <Picture
        className={styles.middle}
        fluid={{
          ...middle.childImageSharp.fluid,
          base64: middle.childImageSharp.sqip.dataURI,
        }}
      />
      <Picture
        className={styles.top}
        fluid={{
          ...top.childImageSharp.fluid,
          base64: top.childImageSharp.sqip.dataURI,
        }}
      />

      <Overlay />
    </div>
  );
};

const Picture: React.FC<{ fluid: FluidObject } & JSX.IntrinsicElements["div"]> = ({ fluid, className, ...rest }) => (
  <div {...rest} className={classnames(styles.imageContainer, className)}>
    <Img fluid={fluid} objectFit="cover" className={styles.image} />
  </div>
);

const Overlay: React.FC = () => (
  <div className={styles.overlay}>
    <div className={styles.overlayTitle}>
      <Brand500px className={styles.icon} />
      <PrettyLink href="https://500px.com/photo/1007403165/The-river-Seine-at-night-by-Marcus-Cemes" target="_blank">
        The river Seine at night
      </PrettyLink>
      &nbsp;by Marcus Cemes
    </div>
  </div>
);
