import classnames from "classnames";
import React, { FunctionComponent } from "react";
import { CSSTransition, SwitchTransition, Transition } from "react-transition-group";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

import { IStyleProps } from "../../../types/component";
import styles from "./animated_check.module.css";

interface IAnimatedCheckProps extends IStyleProps {
  active?: boolean;
  failed?: boolean;
  size?: number;
}

/** Use `AnimatedCheck` to mark a successful/failed operation */
export const AnimatedCheck: FunctionComponent<IAnimatedCheckProps> = ({
  active = false,
  failed = false,
  size = 36,
  style,
  className,
  ...rest
}) => {
  const classNames: CSSTransitionClassNames = {
    enterActive: styles.active,
    appearActive: styles.active,
    enterDone: styles.active,
    appearDone: styles.active,
  };

  return (
    <SwitchTransition>
      {active ? (
        <CSSTransition key={`${failed ? "failed" : "success"}-${size}`} classNames={classNames} timeout={900} appear>
          <svg
            {...rest}
            className={classnames(styles.container, { [styles.failed]: failed }, className)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            style={{
              ...style,
              width: size,
              height: size,
              strokeWidth: Math.ceil(size / (size >= 32 ? 16 : 8)), // was 16
            }}
          >
            <circle
              className={styles.circle}
              cx="26"
              cy="26"
              r="25"
              fill="none"
              style={{
                strokeWidth: Math.ceil(size / (size >= 32 ? 16 : 8)), // was 28
              }}
            />
            <path
              className={styles.path}
              fill="none"
              d={failed ? "M16 16 36 36 M36 16 16 36" : "M14.1 27.2l7.1 7.2 16.7-16.8"}
            />
          </svg>
        </CSSTransition>
      ) : (
        <Transition key="empty" timeout={0}>
          <></>
        </Transition>
      )}
    </SwitchTransition>
  );
};
