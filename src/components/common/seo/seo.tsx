import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";

export const SEO: React.FC<SEOProps> = (props: SEOProps) => {
  const { description, lang, meta, keywords, title } = {
    ...defaultSEOProps,
    ...props,
  };
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;

  let addTheme = true;
  for (const item of meta) {
    if (item.name === "theme-color") {
      addTheme = false;
      break;
    }
  }
  if (addTheme) {
    meta.push({
      name: `theme-color`,
      content: `#FFF`,
    });
  }

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={title ? `%s – ${site.siteMetadata.title}` : site.siteMetadata.title}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(meta)}
    />
  );
};

export interface SEOProps {
  description?: string;
  lang?: string;
  meta?: Array<{ name: string; content: string }>;
  keywords: string[];
  title: string;
}

const defaultSEOProps: SEOProps = {
  description: "",
  lang: "en",
  meta: [],
  keywords: [],
  title: "MasterMovies",
};
