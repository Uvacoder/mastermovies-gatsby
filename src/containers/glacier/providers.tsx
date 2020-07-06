import React, { useReducer } from "react";
import { ThemeContext } from "../../hooks/theme";
import { GlacierContext, GlacierContextDefault, glacierContextReducer } from "./context";

export const GlacierProviders: React.FC = ({ children }) => {
  const context = useReducer(glacierContextReducer, GlacierContextDefault);

  return (
    <ThemeContext.Provider value="dark">
      <GlacierContext.Provider value={context}>{children}</GlacierContext.Provider>
    </ThemeContext.Provider>
  );
};
