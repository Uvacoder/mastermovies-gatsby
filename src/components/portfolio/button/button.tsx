import { GlobalOutlined, RightOutlined } from "@ant-design/icons";
import classnames from "classnames";
import { navigate } from "gatsby";
import React, { cloneElement, isValidElement, ReactNode, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Portal } from "../../common/portal";
import styles from "./button.module.css";

interface IButtonProps {
  icon?: ReactNode;
}

export const PortfolioButton: React.FC<IButtonProps & JSX.IntrinsicElements["a"]> = ({
  className,
  icon,
  onClick,
  children,
  href,
  ...rest
}) => {
  const [play, setPlay] = useState<boolean>(false);
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);

  /** Provide a pretty animation for JS-enabled browsers */
  const clickHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (typeof onClick === "function") onClick(event);

    // Local SPA links
    if (href[0] === "/") {
      navigate(href);
      return;
    }

    setPlay(true);
    setX(event.clientX);
    setY(event.clientY);
    event.preventDefault();
  };

  /** Make the link click-able again after a little while */
  useEffect(() => {
    if (play) {
      const timeout = setTimeout(() => setPlay(false), 1000);
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = href || "";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [play]);

  return (
    <a className={classnames(styles.button, className)} onClick={clickHandler} href={href} {...rest}>
      <Portal>
        <>
          <CSSTransition
            timeout={500}
            in={play}
            mountOnEnter
            unmountOnExit
            classNames={{
              enterActive: styles.show,
              enterDone: styles.show,
              exitActive: styles.exit,
            }}
          >
            <span className={styles.overlay} style={{ top: y, left: x }} />
          </CSSTransition>
        </>
      </Portal>
      {icon ? (
        <span className={styles.icon}>
          <span className={styles.iconWrapper}>
            <RightOutlined className={styles.arrow} />
          </span>
          <span className={styles.iconWrapper}>
            {isValidElement(icon)
              ? cloneElement(icon, { className: classnames(icon.props.className, styles.passive) })
              : icon}
          </span>
          <span className={styles.iconWrapper}>
            <GlobalOutlined className={styles.active} />
          </span>
        </span>
      ) : null}
      {children}
    </a>
  );
};
