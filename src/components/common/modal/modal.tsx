import { PageHeader } from "antd";
import classnames from "classnames";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Transition, TransitionGroup } from "react-transition-group";

import { ThemeContext } from "../../../hooks/theme";
import { Spinner } from "../spinner";
import styles from "./modal.module.css";

interface IModalProps {
  /** Show the overlay, and content in a modal if provided */
  active?: boolean;
  /** Hide the modal header */
  noHeader?: boolean;
  /** Text next to the back button */
  backText?: string;
  /**
   * When the user wants to return, a boolean is passed indicating whether
   * the modal should be completely closed (e.g. clicking the overlay)
   */
  onBack?: (all: boolean) => any;
  /** Lock the <body> from scrolling while modal is active */
  scrollLock?: boolean;
}

/**
 * Use `Modal` to display a beautiful modal. `Modal` takes an array of children. Each child will
 * receive its own modal, and only the last child will be shown at any given moment. When adding or
 * removing children, an animation will to transition between child modals.
 *
 * To retrain the ability to edit children, you must pass a unique `key` prop to each child.
 *
 * If no children are passed and the modal is active, a spinner will be shown. The overlay and modal are
 * fixed positioned to cover the parent. The user of React Portals is recommended.
 *
 * If `scrollLock` is enabled, the body will be locked from scrolling while the `Modal` is active.
 *
 * @todo Fix animation on mobile, better layout, better size
 * @example
 * // Each Step has its own Modal, only Step 3 is visible
 * <Modal active scrollLock>
 *   <Step1 />
 *   <Step2 />
 *   <Step3 />
 * </Modal>
 */
export const Modal: FunctionComponent<IModalProps> = ({
  active = false,
  backText = "Back",
  noHeader = false,
  onBack = () => {
    return;
  },
  children,
}) => {
  // Remember the width of the scrollbar, may not work if the body is not overflowed
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);

  // Lock the body from scrolling without affecting the viewport layout
  useEffect(() => {
    if (active) {
      // Cache the scrollbar size after it disappears
      const newScrollbarWidth = window.innerWidth - document.documentElement.clientWidth || scrollbarWidth;
      if (newScrollbarWidth > 0 && newScrollbarWidth !== scrollbarWidth) {
        setScrollbarWidth(newScrollbarWidth);
      }

      // Increment the lock counter, this is decremented in the cleanup function
      const body = document.getElementsByTagName("body")[0];
      const locks = parseInt(body.getAttribute("data-modal-lock"), 10) || 0;
      const padding = Math.round(newScrollbarWidth).toString() + "px";

      body.style.overflow = "hidden";
      body.style.paddingRight = padding;

      body.setAttribute("data-modal-lock", (locks + 1).toString());

      return () => {
        const newLocks = parseInt(body.getAttribute("data-modal-lock"), 10) || 0;
        // Return the ability to scroll if all locks (from other modals) have been released
        if (newLocks <= 1) {
          body.style.overflow = "";
          body.style.paddingRight = "";
          body.removeAttribute("data-modal-lock");
        } else {
          body.setAttribute("data-modal-lock", (newLocks - 1).toString());
        }
      };
    }
  }, [active]);

  const parsedChildren = React.Children.toArray(children);

  // Create the main transition group and overlay logic
  return (
    <ThemeContext.Provider value="light">
      <Transition in={active} timeout={{ enter: 1000, exit: 1000 }} mountOnEnter unmountOnExit>
        <div className={styles.modalWrapper}>
          <Transition key="overlay" in={active} timeout={{ enter: 10, exit: 600 }} appear>
            {state => (
              <div
                className={classnames(styles.overlay, { [styles.overlayActive]: state === "entered" })}
                onClick={() => onBack(true)}
              >
                <Spinner active={active && parsedChildren.length === 0} delay={1000} />
              </div>
            )}
          </Transition>

          <TransitionGroup
            component={null}
            children={
              !active
                ? []
                : parsedChildren.map((child, i) => (
                    <Transition
                      key={React.isValidElement(child) ? child.key : ""}
                      timeout={{ enter: 10, exit: 600 }}
                      classNames={{ enterDone: styles.modalActive }}
                      appear
                    >
                      {state => (
                        <div
                          className={classnames(styles.modal, {
                            [styles.modalActive]: state === "entered",
                            [styles.modalStacked]: i !== parsedChildren.length - 1,
                          })}
                        >
                          {!noHeader && <PageHeader title={backText} onBack={() => onBack(false)} />}
                          <div className={styles.modalContent}>{child}</div>
                        </div>
                      )}
                    </Transition>
                  ))
            }
          />
        </div>
      </Transition>
    </ThemeContext.Provider>
  );
};
