import React, { FunctionComponent, ReactNode } from "react";

import { ILink } from "../../../config";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

export interface ILogo {
  text: string | ReactNode;
  link: string;
}

export interface INavProps {
  links: ILink[];
  logo?: ILogo;
  type?: "static" | "absolute" | "fixed";
  extended?: boolean;
  background?: boolean;
}

export const Nav: FunctionComponent<INavProps> = ({
  links,
  logo = { text: "MasterMovies", link: "https://mastermovies.uk" },
  type = "static",
  extended = false,
  background = false,
}) => {
  const resolvedProps = { links, logo, type, extended, background };

  return (
    <>
      <Navbar {...resolvedProps} />
      <Sidebar links={links} logo={logo} />
    </>
  );
};
