// Contains definitions for GraphQL queries for Gatsby images

/** The GraphQL fragment returned by `gatsby-image` using `GatsbyImageSharpFluid_withWebp_noBase64` */
export interface IGraphQlFluidImage {
  aspectRatio: number;
  src: string;
  srcSet: string;
  srcWebp: string;
  sercSetWebp: string;
  sizes: string;
}

/** The official GraphQL query for an image object on this site */
export interface IGraphQLImage {
  childImageSharp: {
    fluid: IGraphQlFluidImage;
    sqip: {
      dataURI: string;
    };
  };
}

export interface IGraphQLFile {
  publicURL: string;
}
