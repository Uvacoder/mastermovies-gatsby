import React, { Dispatch } from "react";

import { TGlacierAction } from "./actions";
import { IGlacierContext } from "./types";

export const GlacierContext = React.createContext<[IGlacierContext, Dispatch<TGlacierAction>]>(null);
