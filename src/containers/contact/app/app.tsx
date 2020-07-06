import React from "react";
import { Nav } from "../../../components/common/nav";
import { NAV_LINKS } from "../../../config";
import styles from "./app.module.css";
import { ContactForm } from "./card";

export const ContactApp: React.FC = () => (
  <div className={styles.container}>
    <Nav links={NAV_LINKS} type="static" extended />

    <div className={styles.spacerTop} />
    <ContactForm />
    <div className={styles.spacerBottom} />
  </div>
);
