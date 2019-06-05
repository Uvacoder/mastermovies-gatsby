import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";
import classnames from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./dark_button.module.css";

export const DarkButton: FunctionComponent<ButtonProps> = ({ className, ...rest }) => (
  <Button
    {...rest}
    type="ghost"
    className={classnames(styles.darkButton, className)}
  />
);