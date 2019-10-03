import { Button, Icon } from "antd";
import classnames from "classnames";
import React, { FunctionComponent } from "react";

import { IHumanError } from "../../../../../types/app";
import { ContactOwlFly, ContactOwlSit } from "../owl";
import styles from "./overlay.module.css";

interface IContactFormOverlayProps {
  active: boolean;
  success: boolean;
  error?: IHumanError;
  onRetry?: () => any;
}

// TODO attribute Vector Design by <a href="https://vecteezy.com">Vecteezy.com</a>

export const ContactFormOverlay: FunctionComponent<IContactFormOverlayProps> = ({
  active,
  success,
  error,
  onRetry,
}) => {
  const title = success ? "An owl has been issued with your message." : "Our owls are refusing to fly!";

  const subtitle = success ? (
    "If you gave us an email, we will get back to you promptly."
  ) : error ? (
    <span style={{ textAlign: "center" }}>
      <Icon type={error.icon} />
      {error.text}
      <br />
      <code>{error.code}</code>
    </span>
  ) : (
    "An unknown error occurred"
  );

  const content = (
    <>
      <div className={styles.owlContainer}>
        <ContactOwlFly
          className={classnames(styles.owl, styles.flyIn)}
          data-active={active && success ? "" : void 0}
          style={{ transitionDelay: active ? "1s" : "0.4s" }}
        />
        <ContactOwlSit
          className={classnames(styles.owl, styles.scaleIn)}
          data-active={active && !success ? "" : void 0}
          style={{ transitionDelay: active ? "1s" : "0.4s" }}
        />
      </div>
      <h3 className={styles.stagger} style={{ transitionDelay: active ? "1.2s" : "0.4s" }}>
        {title}
      </h3>
      <p className={styles.stagger} style={{ transitionDelay: active ? "1.4s" : "0.2s" }}>
        {subtitle}
      </p>
      <p
        className={styles.stagger}
        style={{
          transitionDelay: active ? "1.6s" : "0s",
          visibility: !success && typeof onRetry === "function" ? "visible" : "hidden",
        }}
      >
        <Button onClick={() => onRetry()}>Retry</Button>
      </p>
    </>
  );

  return (
    <div
      className={classnames(styles.overlay, { [styles.active]: active })}
      style={{ transitionDelay: active ? "0s" : "0.8s" }}
    >
      {content}
    </div>
  );
};
