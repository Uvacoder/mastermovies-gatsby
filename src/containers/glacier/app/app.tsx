import { Router } from "@reach/router";
import React, { FunctionComponent } from "react";

import { GlacierNotFound } from "../../../components/glacier/not_found";
import styles from "./app.module.css";
import { GlacierMain } from "./main";

/** Render the glacier app in the browser */
export const GlacierApp: FunctionComponent = () => (
  <div className={styles.glacierApp}>
    <Router primary={false}>
      <GlacierMain path="/glacier" />
      <GlacierMain path="/glacier/about" />
      <GlacierMain path="/glacier/status" />
      <GlacierMain path="/glacier/logout" />
      <GlacierMain path="/glacier/film/:film" />
      <GlacierNotFound default />
    </Router>
  </div>
);
