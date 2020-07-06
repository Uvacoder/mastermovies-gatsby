import { Router } from "@reach/router";
import React from "react";

import { GlacierNotFound } from "../../components/glacier/not_found/not_found";
import styles from "./app.module.css";
import { GlacierLayout } from "./layout";
import { GlacierProviders } from "./providers";

/**
 * Creates a Reach router for the Glacier app.
 *
 * Each path must have the same key to avoid React unmounting and re-mounting
 * the component.
 */
export const GlacierApp: React.FC = () => (
  <GlacierProviders>
    <Router primary={false} className={styles.app} basepath="/glacier">
      <GlacierLayout path="/" key="glacier" />
      <GlacierLayout path="/film/:film" key="glacier" />
      <GlacierLayout path="/download/:exp" key="glacier" />
      <GlacierNotFound default />
    </Router>
  </GlacierProviders>
);
