import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { ContactCardContentForm } from "../form";
import { ContactOwlSit } from "../owl";
import styles from "./right.module.css";

export const ContactCardRight: React.FC = () => {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);

  return (
    <div className={classnames(styles.container, { [styles.show]: show })}>
      <div className={classnames(styles.header, styles.stagger)} style={{ transitionDelay: "0.6s" }}>
        <ContactOwlSit className={styles.owl} />
        Let an owl carry the message for you
      </div>

      <div className={styles.stagger} style={{ transitionDelay: "0.7s" }}>
        <ContactCardContentForm />
      </div>
    </div>
  );
};
