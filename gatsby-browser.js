/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

 /** Disable scrolling if *noScroll: true* is passed */
exports.shouldUpdateScroll = ({ routerProps }) => {
  if (
    typeof routerProps.location === "object"
    && typeof routerProps.location.state === "object"
    && routerProps.location.state.noScroll === true
  ) return false;
  return true;
}
