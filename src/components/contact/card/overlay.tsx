import { Button } from "antd";
import classnames from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./overlay.module.css";
import { ContactCardOwlFly } from "./owl_fly";
import { ContactCardOwlSit } from "./owl_sit";

interface IContactFormOverlayProps {
  active: boolean;
  success: boolean;
  error?: "limit" | "csrf";
  onRetry?: () => any;
}

// TODO attribute Vector Design by <a href="https://vecteezy.com">Vecteezy.com</a>

export const ContactFormOverlay: FunctionComponent<
  IContactFormOverlayProps
> = ({ active, success, error, onRetry }) => {
  const title = success
    ? "An owl has been issued with your message."
    : error === "limit"
    ? "There aren't any owls left!"
    : error === "csrf"
    ? "Hey! Is that one of ours?"
    : "The owl's refusing to fly!";

  const subtitle = success ? (
    "If you gave us an email, we will get back to you promptly."
  ) : error === "limit" ? (
    "You hit the limit, try again in a few minutes."
  ) : error === "csrf" ? (
    <span>
      We could not verify the authenticity of the request.
      <br />
      Make sure that you're on the correct domain.
      <br />
      <sub>
        <code>Error: Bad CSRF token</code>
      </sub>
    </span>
  ) : (
    <span>
      An unknown error occurred... Try again in a few minutes.
      {error && (
        <>
          <br />
          <sub>
            <code>Error: {error}</code>
          </sub>
        </>
      )}
    </span>
  );

  const content = (
    <>
      <div className={styles.owlContainer}>
        <ContactCardOwlFly
          className={classnames(styles.owl, styles.flyIn)}
          data-active={active && success ? "" : void 0}
          style={{ transitionDelay: active ? "1s" : "0.4s" }}
        />
        <ContactCardOwlSit
          className={classnames(styles.owl, styles.scaleIn)}
          data-active={active && !success ? "" : void 0}
          style={{ transitionDelay: active ? "1s" : "0.4s" }}
        />
      </div>
      <h3
        className={styles.stagger}
        style={{ transitionDelay: active ? "1.2s" : "0.4s" }}
      >
        {title}
      </h3>
      <p
        className={styles.stagger}
        style={{ transitionDelay: active ? "1.4s" : "0.2s" }}
      >
        {subtitle}
      </p>
      <p
        className={styles.stagger}
        style={{
          transitionDelay: active ? "1.6s" : "0s",
          visibility:
            !success && typeof onRetry === "function" ? "visible" : "hidden",
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
