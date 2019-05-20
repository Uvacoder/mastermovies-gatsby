import "swagger-ui/dist/swagger-ui.css";

import { Alert } from "antd";
import React, { useEffect, useRef, useState } from "react";

import { SEO } from "../components/common/seo";
import { DocsLayout } from "../components/docs/layout";

export default () =>  {

  const ref = useRef(null);
  const [ failure, setFailure ] = useState(false);

  useEffect(() => {
    if (window.SSR !== true) {
      import("swagger-ui").then(lib => {
        try {
          (lib.default || lib)({
            domNode: ref.current,
            url: "https://api.mastermovies.uk/v2/openapi.json"
          });
        } catch (err) {
          setFailure(true);
        }
      });
    }
  }, []);

  return (
    <>
      <SEO
        title="API"
        keywords={["MasterMovies", "docs", "application", "documentation", "api"]}
      />
      <DocsLayout>
        {failure && <Alert
          style={{marginTop: 32}}
          message="Error"
          description="Some sort of error occurred while loading OpenAPI"
          type="error"
          showIcon
        />}
        <div ref={ref} />
      </DocsLayout>
    </>
  )
}
