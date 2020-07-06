import { RouteComponentProps } from "@reach/router";
import React from "react";
import { MasterMoviesLogo } from "../../common/logos";
import { NotFound } from "../../common/not_found";

export const GlacierNotFound: React.FC<RouteComponentProps> = () => (
  <NotFound buttonLink="/glacier" logo={<MasterMoviesLogo fill="#fff" width="64px" />} />
);
