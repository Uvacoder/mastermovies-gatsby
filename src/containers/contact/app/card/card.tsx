import classnames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./card.module.css";
import { ContactCardDivider } from "./divider";
import { ContactCardLeft } from "./left";
import { ContactCardRight } from "./right";

export const ContactForm: React.FC = () => {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);

  return (
    <div className={classnames(styles.card, { [styles.show]: show })}>
      <ContactCardLeft />
      <ContactCardDivider />
      <ContactCardRight />
    </div>
  );
};
