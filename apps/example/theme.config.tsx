import { createtheme } from "@lightbase/rn-design-system";

import { fontConfig } from "./theme.typography";

type MyConfig = typeof theme;
declare module "@lightbase/rn-design-system" {
  export interface LBCustomConfig extends MyConfig {}
}

// FUNCTIONS
export const theme = createtheme({
  typography: {
    fonts: fontConfig,
    sizes: {
      "32px": { fontSize: 32, lineHeight: 36 },
      "28px": { fontSize: 28, lineHeight: 34 },
      "18px": { fontSize: 18, lineHeight: 26 },
    },
  },
  colors: {
    light: { primary: "red" },
    dark: { primary: "blue" },
  },
  spacing: {
    "4px": 0,
    "5px": 5,
    "8px": 8,
    "9px": 9,
    "12px": 10,
    "16px": 16,
    "18px": 18,
    "20px": 20,
    "22px": 22,
    "24px": 24,
    "28px": 28,
    "32px": 32,
    "40px": 40,
    "48px": 48,
    "60px": 60,
  },
  radius: {
    "0px": 0,
    "4px": 4,
    "5px": 5,
    button: 8,
    "10px": 10,
    full: 9999,
  },
  variants: {
    Text: {
      good: { family: "Montserrat", weight: "thin", size: "32px", color: "primary" },
    },
    Button: {},
  },
  defaults: {
    Text: { family: "Montserrat" },
    Button: {},
    Screen: {
      paddingHorizontal: "12px",
    },
  },
});
