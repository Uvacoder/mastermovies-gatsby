import { Icon } from "antd";
import { IconProps } from "antd/lib/icon";
import classnames from "classnames";
import React, { CSSProperties, FunctionComponent } from "react";

import styles from "./icon_margin.module.css";

interface IIconMarginProps extends IconProps {
  marginLeft?: boolean | CSSProperties["marginLeft"];
  marginRight?: boolean | CSSProperties["marginRight"];
}

/** Extends the Ant Design Icon with easy left/right margins */
export const IconMargin: FunctionComponent<IIconMarginProps> = ({
  marginLeft = false,
  marginRight = false,
  style,
  className,
  ...rest
}) => (
  <Icon
    {...rest}
    style={{
      ...style,
      marginLeft:
        typeof marginLeft === "number" || typeof marginLeft === "string" ? marginLeft : style && style.marginLeft,
      marginRight:
        typeof marginRight === "number" || typeof marginRight === "string" ? marginRight : style && style.marginRight,
    }}
    className={classnames({ [styles.marginLeft]: marginLeft, [styles.marginRight]: marginRight }, className)}
  />
);
