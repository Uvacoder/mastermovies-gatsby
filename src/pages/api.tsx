import React from "react";

import { SEO } from "../components/common/seo";
import { ApiSpec } from "../containers/api/api_spec";

export default () => (
  <>
    <SEO title="API" keywords={["MasterMovies", "docs", "application", "documentation", "api"]} />
    <ApiSpec />
  </>
);
