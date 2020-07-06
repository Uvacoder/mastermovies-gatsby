import React, { ReactNode } from "react";
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
  /* Hide the logo and align links to the left */
  left?: boolean;
  hideLogo?: boolean;
}

export const Nav: React.FC<INavProps> = ({
  links,
  logo = { text: "MasterMovies", link: "https://mastermovies.uk" },
  type = "static",
  extended = false,
  background = false,
  left = false,
  hideLogo = false,
}) => {
  const resolvedProps = { links, logo, type, extended, background, left, hideLogo };

  return (
    <>
      <Navbar {...resolvedProps} />
      <Sidebar links={links} logo={logo} />
    </>
  );
};
