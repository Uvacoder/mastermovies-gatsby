import React, { FunctionComponent, ReactNode, useState } from "react";

import { ILink } from "../../../config";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

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

export interface INavPropsWithState {
  links: ILink[];
  theme: "light" | "dark";
  logo: ILogo;
  type: "static" | "absolute" | "fixed";
  extended: boolean;
  background: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Nav: FunctionComponent<INavProps> = ({
  links,
  theme = "light",
  logo = { text: "MasterMovies", link: "https://mastermovies.uk" },
  type = "static",
  extended = false,
  background = false,
}) => {
  const resolvedProps = { links, theme, logo, type, extended, background };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar
        {...resolvedProps}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar
        {...resolvedProps}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </>
  );
};
