import classnames from "classnames";
import { EventEmitter } from "events";
import React from "react";
import { Wave } from "../../common/wave";
import styles from "./dark_button.module.css";

type TButtonProps = JSX.IntrinsicElements["button"];

interface IDarkButtonProps extends TButtonProps {
  large?: boolean;
  disabled?: boolean;
}

/** Use `DarkButton` for dark themes. Inspired by Ant Design's button */
export const DarkButton: React.FC<IDarkButtonProps> = ({ large, disabled, className, children, onClick, ...rest }) => {
  const emitter = new EventEmitter();

  const clickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      emitter.emit("click");
      if (typeof onClick === "function") onClick(e);
    }
  };

  return (
    <button
      {...rest}
      disabled={disabled}
      className={classnames(styles.darkButton, { [styles.large]: large, [styles.disabled]: disabled }, className)}
      onClick={clickHandler}
    >
      {children}
      <Wave colour="#fff" eventEmitter={emitter} />
    </button>
  );
};
