import { useContext, useMemo } from "react";
import { LBConfig } from "types";

import { ThemeContext } from "../context/ThemeProvider";

export function useInternalTheme(mode?: "light" | "dark"): {
  colors: LBConfig["colors"]["light"];
  typography: LBConfig["typography"];
  variants: LBConfig["variants"];
  spacing: LBConfig["spacing"];
  radius: LBConfig["radius"];
  defaults: LBConfig["defaults"];
} {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("No Theme found");
  }
  const { colors, ...rest } = theme;

  const themeColors = colors[mode ?? "light"] as LBConfig["colors"]["light"];
  if (!themeColors) {
    throw new Error("No colors found");
  }

  return useMemo(() => ({ colors: themeColors, ...rest }), [rest, themeColors]);
}
