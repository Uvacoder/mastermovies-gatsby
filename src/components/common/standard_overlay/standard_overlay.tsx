import { Button, Icon } from "antd";
import classnames from "classnames";
import hash from "hash-sum";
import React, { FunctionComponent } from "react";
import { Transition, TransitionGroup } from "react-transition-group";

import styles from "./standard_overlay.module.css";

type divProps = JSX.IntrinsicElements["div"];
interface IStandardOverlayProps extends divProps {
  active?: boolean;
  icon?: string;
  text?: string;
  button?: string;
  onButton?: () => any;
  theme?: "light" | "dark";
  shimmer?: boolean;
  dim?: boolean;
}


/** Display a configurable overlay, with an icon and optional button */
export const StandardOverlay: FunctionComponent<IStandardOverlayProps> = ({
  active = false,
  icon = "",
  text = "",
  button = "",
  onButton = () => {},
  shimmer = false,
  theme = "light",
  dim = false,
  className,
  ...rest
}) => (
  <TransitionGroup component={null}>
    {active && (
      <Transition key={hash({active, icon, text, button, onButton, shimmer, theme, className, ...rest})} timeout={{enter: 200, exit: 300}}>
        {state => (
          <div
            {...rest}
            className={classnames(styles.overlay, {[styles.dark]: theme === "dark", [styles.active]: state === "entered", [styles.dim]: dim}, className)}
          >
            <span className={classnames(styles.container, {[styles.shimmer]: shimmer})}>
              {icon && <Icon type={icon} className={styles.icon}/>}
              <span>{text}</span>
              {button && <Button className={styles.button} ghost={theme === "dark"} onClick={() => onButton()}>{button}</Button>}
            </span>
          </div>
        )}
      </Transition>
    )}
  </TransitionGroup>
);
