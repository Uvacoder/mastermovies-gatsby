import { CSSProperties } from "react";

export interface IStyleProps {
  /** Additional styles to pass through to the component */
  style?: CSSProperties;
  /** Additional classnames to pass through to the component */
  className?: string;
}
