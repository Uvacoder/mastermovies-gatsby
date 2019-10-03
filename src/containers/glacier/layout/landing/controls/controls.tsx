import React, { FunctionComponent } from "react";

import { GlacierLayoutSelector } from "./layout_selector";
import { GlacierMenu } from "./menu";
import { GlacierSortSelector } from "./sort";

export const GlacierControls: FunctionComponent = () => (
  <>
    <GlacierMenu />
    <GlacierLayoutSelector />
    <GlacierSortSelector />
  </>
);
