import "swagger-ui-react/swagger-ui.css";

import { Spin } from "antd";
import React, { FunctionComponent } from "react";

import { ApiLayout } from "../../../components/api/layout";
import { FadeTransition } from "../../../components/common/fade_transition";
import { Footer } from "../../../components/common/footer";
import { Nav } from "../../../components/common/nav";
import { StandardOverlay } from "../../../components/common/standard_overlay";
import { NAV_LINKS } from "../../../config";
import { useApiSpec } from "../../../hooks/api/open_api";
import styles from "./api_spec.module.css";

// tslint:disable-next-line:no-var-requires
const SwaggerUI = typeof window !== `undefined` ? require("swagger-ui-react").default : null;

export const ApiSpec: FunctionComponent = () => {
  const [spec, error, retry] = useApiSpec();

  return (
    <div className={styles.apiSpec}>
      <Nav links={NAV_LINKS} extended={true} />

      {error ? (
        <StandardOverlay active text={error.text} code={error.code} icon={error.icon} button="Retry" onButton={retry} />
      ) : !spec ? (
        <Spin spinning={!spec} className={styles.spinner} />
      ) : (
        <SpecDocument spec={spec} />
      )}

      <Footer />
    </div>
  );
};

const SpecDocument: FunctionComponent<{ spec: any }> = ({ spec }) => {
  if (typeof window === "undefined") return null; // gatsby SSR

  return (
    <FadeTransition in={!!spec} unmountOnExit>
      <ApiLayout>{spec && SwaggerUI && <SwaggerUI spec={spec} />}</ApiLayout>
    </FadeTransition>
  );
};
