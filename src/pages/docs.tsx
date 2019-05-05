import "swagger-ui/dist/swagger-ui.css";

import React, { useEffect, useRef } from "react";

import { SEO } from "../components/common/SEO";

declare global {
  interface Window { SwaggerUI: (config: any) => void }
}

export default () =>  {

  const ref = useRef(null);

  useEffect(() => {
    window.SwaggerUI({
      domNode: ref.current,
      url: "https://api.mastermovies.co.uk/v2/openapi.json"
    });
  }, []);

  return (
    <>
      <SEO
        title="API"
        keywords={["MasterMovies", "docs", "application", "documentation", "api"]}
      />
      <div ref={ref} />
    </>
  )
}
