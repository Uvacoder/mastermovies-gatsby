import React, { FunctionComponent } from "react";

import { links } from "../../../config";
import { Nav } from "../../../components/common/nav";
import { ContactForm } from "./card";
import styles from "./app.module.css";

export const ContactApp: FunctionComponent = () => (
  <div className={styles.container}>
    <Nav links={links} type="static" extended />

    <div className={styles.spacerTop} />
    <ContactForm />
    <div className={styles.spacerBottom} />
  </div>
);
