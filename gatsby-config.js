module.exports = {
  siteMetadata: {
    title: "MasterMovies",
    description: "The official MasterMovies website",
    author: "@MarcusCemes",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-create-client-paths",
      options: { prefixes: ["/glacier/*", "/test/*"] },
    },
    "gatsby-plugin-remove-trailing-slashes",
    "gatsby-plugin-typescript",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-sharp",
      options: {
        stripMetadata: true,
        defaultQuality: 75,
      },
    },
    "gatsby-transformer-sqip",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "gatsby-starter-default",
        short_name: "mastermovies",
        start_url: "/",
        background_color: "#FFF",
        // theme_color: "#FFF", // react-helmet
        display: "minimal-ui",
        icon: "src/images/logo/mastermovies-black.png",
      },
    },
    {
      resolve: "gatsby-plugin-import",
      options: {
        libraryName: "antd",
        style: "css",
      },
    },
    {
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: "#65C3BA",
      },
    },
    {
      resolve: "gatsby-source-build-info",
      options: {
        path: `${__dirname}`,
      },
    },
    // {
    //   resolve: "gatsby-plugin-webpack-bundle-analyzer",
    //   options: {
    //     production: true
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // "gatsby-plugin-offline",
  ],
};
