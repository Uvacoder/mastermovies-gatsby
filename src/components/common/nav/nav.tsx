import React, { FunctionComponent, ReactNode } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

export interface ILink {
  text: string;
  link: string;
}

export interface ILogo {
  text: string | ReactNode;
  link: string;
}

export interface INavProps {
  links: ILink[];
  theme?: "light" | "dark";
  logo?: ILogo;
  type?: "static" | "absolute" | "fixed";
  extended?: boolean;
  background?: boolean;
}

export const Nav: FunctionComponent<INavProps> = ({
  links,
  theme = "light",
  logo = { text: "MasterMovies", link: "https://mastermovies.uk" },
  type = "static",
  extended = false,
  background = false
}) => {

  const resolvedProps = { links, theme, logo, type, extended, background };

  return (
  <>
    <Navbar {...resolvedProps} />
    <Sidebar {...resolvedProps}  />
  </>);
}