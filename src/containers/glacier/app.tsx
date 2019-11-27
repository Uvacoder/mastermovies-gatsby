import { Router } from "@reach/router";
import React, { FunctionComponent } from "react";

import { GlacierNotFound } from "../../components/glacier/not_found/not_found";
import styles from "./app.module.css";
import { GlacierLayout } from "./layout";
import { GlacierProviders } from "./providers";

/** Creates a Reach router for the Glacier app */
export const GlacierApp: FunctionComponent = () => (
  <GlacierProviders>
    <Router primary={false} className={styles.app} basepath="/glacier">
      <GlacierLayout path="/" />
      <GlacierLayout path="/film/:film" />
      <GlacierLayout path="/download/:exp" />
      <GlacierNotFound default />
    </Router>
  </GlacierProviders>
);
