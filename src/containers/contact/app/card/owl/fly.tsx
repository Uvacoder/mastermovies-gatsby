import { graphql, useStaticQuery } from "gatsby";
import React from "react";

type imgProps = JSX.IntrinsicElements["img"];

export const ContactOwlFly: React.FC<imgProps> = ({ style, ...rest }) => {
  const query = useStaticQuery(graphql`
    query {
      owlImage: file(relativePath: { eq: "contact/owl-fly-blue.svg" }) {
        publicURL
      }
    }
  `);
  return <img {...rest} style={{ ...style, pointerEvents: "none" }} src={query.owlImage.publicURL} />;
};
