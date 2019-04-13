module.exports = {
  siteMetadata: {
    title: `MasterMovies`,
    description: `The official MasterMovies website`,
    author: `@MarcusCemes`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `mastermovies`,
        start_url: `/`,
        background_color: `#5ABDFC`,
        theme_color: `#5ABDFC`,
        display: `minimal-ui`,
        icon: `src/images/logo/default.png`
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
