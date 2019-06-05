import { PageHeader } from "antd";
import classnames from "classnames";
import React, { FunctionComponent } from "react";
import { Transition, TransitionGroup } from "react-transition-group";

import { Spinner } from "../spinner";
import styles from "./modal.module.css";


interface IModalProps {
  /** Show the overlay, and content in a modal if provided */
  active?: boolean;
  /** Text next to the back button */
  backText?: string;
  /**
   * When the user wants to return, a boolean is passed indicating whether
   * the modal should be completely closed (e.g. clicking the overlay)
  */
  onBack?: (all: boolean) => any;
}

/**
 * Helper to display beautiful modal. When active, the overlay will be shown, and unless content is
 * provided (children prop) a spinner will be displayed.
 *
 * Multiple children can be passed, each will get it's own stacked modal.
 */
export const Modal: FunctionComponent<IModalProps> = ({
  active = false,
  backText = "Back",
  onBack = () => {},
  children
}) => {

  // Find last valid child element
  let lastIndex = 0;
  if (Array.isArray(children)) {
    for (let i = children.length - 1; i !== 0; i--) {
      if (children[i]) {
        lastIndex = i;
        break;
      }
    }
  }

  // Create a list of transitioned children modals
  const parsedChildren = React.Children.map(children, (child, i) => {
    if (!child) return;
    return (
      <Transition timeout={{ enter: 0, exit: 1000 }}>
        {state => (
          <div className={classnames(styles.modal, {[styles.active]: state === "entered" && i === lastIndex})}>
            <PageHeader title={backText} onBack={() => onBack(false)} />

            <div className={styles.modalContent}>
              {child}
            </div>
          </div>
        )}
      </Transition>
    );
  });

  // Create the main transition group and overlay logic
  return (
    <TransitionGroup component={null}>

      {active && (
        <Transition key="ModalOverlay" timeout={{ enter: 0, exit: 900 }}>
          {state => (
            <div className={classnames(styles.overlay, {[styles.active]: state === "entered"})} onClick={() => onBack(true)}>
              <Spinner active={active && parsedChildren.length === 0} theme="dark" delay={1000} />
            </div>
          )}
        </Transition>
      )}

      {active && parsedChildren}

    </TransitionGroup>
  );

}