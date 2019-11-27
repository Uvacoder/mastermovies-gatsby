import classnames from "classnames";
import { Link } from "gatsby";
import React, { FunctionComponent } from "react";

import styles from "./link.module.css";

export const PrettyLink: FunctionComponent<JSX.IntrinsicElements["a"]> = ({ className, href, children, ...rest }) =>
  href[0] === "/" ? (
    <Link to={href} className={classnames(styles.link, className)} children={children} />
  ) : (
    <a className={classnames(styles.link, className)} children={children} href={href} {...rest} />
  );
