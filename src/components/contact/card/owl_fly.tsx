import React from "react";
import { FunctionComponent } from "react";
import { useStaticQuery, graphql } from "gatsby";

type imgProps = JSX.IntrinsicElements["img"];

export const ContactCardOwlFly: FunctionComponent<imgProps> = ({
  style,
  ...rest
}) => {
  const query = useStaticQuery(graphql`
    query {
      owlImage: file(relativePath: { eq: "contact/owl-fly-blue.svg" }) {
        publicURL
      }
    }
  `);
  return (
    <img
      {...rest}
      style={{ ...style, pointerEvents: "none" }}
      src={query.owlImage.publicURL}
    />
  );
};
