import { Link } from "gatsby";
import React, { FunctionComponent, ReactNode } from "react";


interface ISmartLinkProps {
  link: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Returns a Gatsby <Link to... /> or a <a href... />, for paths and URLs respectively */
export const SmartLink: FunctionComponent<ISmartLinkProps> = ({ link, children, className, style }) => {
  return (/^\/.*$/).test(link) ?
    <Link className={className} to={link} children={children} />
    :
    <a className={className} style={style} href={link} children={children} />;
};
