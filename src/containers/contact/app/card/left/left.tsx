import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { SOCIAL_LINKS } from "../../../../../config";
import styles from "./left.module.css";

export const ContactCardLeft: React.FC = React.memo(() => {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);

  return (
    <div className={classnames(styles.container, { [styles.show]: show })}>
      <h1 className={styles.stagger} style={{ transitionDelay: "0.2s" }}>
        Leave me a <b>message</b>.
      </h1>
      <p className={styles.stagger} style={{ transitionDelay: "0.3s" }}>
        Find me on one of my social profiles
      </p>

      <p className={styles.stagger} style={{ transitionDelay: "0.4s" }}>
        {SOCIAL_LINKS.map((link) => (
          <a className={styles.socialLink} key={link.text} href={link.link} target="_blank">
            <link.icon />
          </a>
        ))}
      </p>
    </div>
  );
});
