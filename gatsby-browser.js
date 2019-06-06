/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

 /** Disable scrolling if *noScroll: true* is passed */
exports.shouldUpdateScroll = ({ routerProps }) => {
  if (
    isObj(routerProps)
    && isObj(routerProps.location)
    && isObj(routerProps.location.state)
    && routerProps.location.state.noScroll === true
  ) return false;
  return true;
}

function isObj(obj) {
  return obj !== null && typeof obj === "object";
}