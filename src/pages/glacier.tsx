import React from "react";

import { SEO } from "../components/common/seo";
import { GlacierApp } from "../containers/glacier/app";

export default () => {
  return (
    <>
      <SEO
        title="Glacier"
        keywords={["MasterMovies", "glacier", "films", "application"]}
        meta={[
          { name: "theme-color", content: "#000" },
          { name: "apple-mobile-web-app-status-bar-style", content: "black" },
        ]}
      />
      <GlacierApp />
    </>
  );
};
