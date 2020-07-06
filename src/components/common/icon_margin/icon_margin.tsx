import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import cn from "classnames";
import React, { CSSProperties } from "react";
import styles from "./icon_margin.module.css";

/** Extends the Ant Design Icon with easy left/right margins */
export const IconMargin: React.FC<
  {
    icon: React.FC<AntdIconProps>;
    left?: boolean | CSSProperties["marginLeft"];
    right?: boolean | CSSProperties["marginRight"];
  } & AntdIconProps
> = ({ icon: Icon, left = false, right = false, style, className, ...rest }) => (
  <Icon
    {...rest}
    style={{
      ...style,
      marginLeft: typeof left === "number" || typeof left === "string" ? left : style && style.left,
      marginRight: typeof right === "number" || typeof right === "string" ? right : style && style.right,
    }}
    className={cn({ [styles.left]: left, [styles.right]: right }, className)}
  />
);
