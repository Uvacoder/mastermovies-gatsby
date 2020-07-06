import React from "react";

import styles from "./cards.module.css";
import { StatusCardsServer } from "./server";
import { StatusCardsSite } from "./site";

export const StatusCards: React.FC = () => {
  return (
    <div className={styles.column}>
      <Heading>Site information</Heading>
      <StatusCardsSite />
      <div className={styles.separator} />

      <Heading>Server status</Heading>
      <StatusCardsServer />
      <div className={styles.separator} />
      <div className={styles.separator} />
    </div>
  );
};

const Heading: React.FC = (props) => <h3 className={styles.heading} {...props} />;
