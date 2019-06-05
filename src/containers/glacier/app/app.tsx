import { createHistory, createMemorySource, LocationProvider, Router } from "@reach/router";
import React, { FunctionComponent } from "react";

import { GlacierNotFound } from "../../../components/glacier/not_found";
import styles from "./app.module.css";
import { GlacierMain } from "./main";

/** Render the glacier app in the browser */
export const GlacierApp: FunctionComponent = () => {

  // Create a custom context, avoids scrolling top the top on routing
  const history = typeof window !== "undefined" && window.history?
    //@ts-ignore Following the documentation...
    createHistory(window)
    : createMemorySource("/glacier");

  return (
    <div className={styles.glacierApp}>
      <LocationProvider history={history}>
        <Router primary={false}>
          <GlacierMain path="/glacier" />
          <GlacierMain path="/glacier/status" />
          <GlacierMain path="/glacier/logout" />
          <GlacierMain path="/glacier/film/:film" />
          <GlacierNotFound default />
        </Router>
      </LocationProvider>
    </div>
  );
};
