import { Button, Icon } from "antd";
import classnames from "classnames";
import hash from "hash-sum";
import React, { FunctionComponent, ReactNode, useContext } from "react";
import { Transition, TransitionGroup } from "react-transition-group";

import { ThemeContext } from "../../../hooks/theme";
import { DarkButton } from "../../glacier/dark_button";
import styles from "./standard_overlay.module.css";

type divProps = JSX.IntrinsicElements["div"];
interface IStandardOverlayProps extends divProps {
  active?: boolean;
  icon?: string;
  text?: ReactNode;
  button?: ReactNode;
  onButton?: () => any;
  shimmer?: boolean;
  dim?: boolean;
  background?: boolean;
  code?: ReactNode;
}

/** Display a configurable overlay, with an icon and optional button */
export const StandardOverlay: FunctionComponent<IStandardOverlayProps> = ({
  active = false,
  icon = "",
  text = "",
  button = "",
  onButton = () => {},
  shimmer = false,
  dim = false,
  background = false,
  code,
  className,
  ...rest
}) => {
  const theme = useContext(ThemeContext);

  return (
    <TransitionGroup component={null}>
      {active && (
        <Transition
          key={hash({
            active,
            icon,
            text,
            button,
            onButton,
            shimmer,
            theme,
            className,
            ...rest,
          })}
          timeout={{ enter: 200, exit: 300 }}
        >
          {state => (
            <div
              {...rest}
              className={classnames(
                styles.overlay,
                {
                  [styles.dark]: theme === "dark",
                  [styles.active]: state === "entered",
                  [styles.dim]: dim,
                  [styles.background]: background,
                },
                className
              )}
            >
              <span
                className={classnames(styles.container, {
                  [styles.shimmer]: shimmer,
                })}
              >
                {icon && <Icon type={icon} className={styles.icon} />}
                <span>{text}</span>
                {code && <code className={styles.code}>{code}</code>}
                {button &&
                  (theme === "dark" ? (
                    <DarkButton className={styles.button} onClick={onButton}>
                      {button}
                    </DarkButton>
                  ) : (
                    <Button className={styles.button} onClick={onButton}>
                      {button}
                    </Button>
                  ))}
              </span>
            </div>
          )}
        </Transition>
      )}
    </TransitionGroup>
  );
};
