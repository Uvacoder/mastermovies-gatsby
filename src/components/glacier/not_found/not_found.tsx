import { RouteComponentProps } from "@reach/router";
import React, { FunctionComponent } from "react";

import { GlacierLogo } from "../../common/logos";
import { NotFound } from "../../common/not_found";

export const GlacierNotFound: FunctionComponent<RouteComponentProps> = () => (
  <NotFound buttonLink="/glacier" logo={<GlacierLogo />} />
);
