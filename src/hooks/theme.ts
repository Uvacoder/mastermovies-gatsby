import { createContext } from "react";

type ITheme = "light" | "dark";

export const ThemeContext = createContext<ITheme>("light");
