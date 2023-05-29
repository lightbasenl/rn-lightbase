import { useContext, useMemo } from "react";

import { ThemeContext } from "../context/ThemeProvider";

export function useInternalTheme(mode?: "light" | "dark") {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("No Theme found");
  }
  const { colors, ...rest } = theme;

  const themeColors = colors[mode ?? "light"];
  if (!themeColors) {
    throw new Error("No colors found");
  }

  return useMemo(() => ({ colors: themeColors, ...rest }), [rest, themeColors]);
}
