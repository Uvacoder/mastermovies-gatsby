import React from "react";

import { GlacierLayoutSelector } from "./layout_selector";
import { GlacierMenu } from "./menu";
import { GlacierSortSelector } from "./sort";

export const GlacierControls: React.FC = () => (
  <>
    <GlacierMenu />
    <GlacierLayoutSelector />
    <GlacierSortSelector />
  </>
);
