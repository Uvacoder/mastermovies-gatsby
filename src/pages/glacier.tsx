import { Router } from "@reach/router";
import React from "react";

import { SEO } from "../components/common/seo";
import { GlacierLanding } from "../components/glacier/landing/landing";
import { GlacierNotFound } from "../components/glacier/not_found";

export default () =>  {
  return (
    <>
      <SEO
        title="Glacier"
        keywords={[ "MasterMovies", "glacier", "films", "application" ]}
      />

    <Router>
      <GlacierLanding path="/glacier" />
      <GlacierLanding path="/glacier/film/:film" />
      <GlacierNotFound default />
    </Router>
    </>
  )
}