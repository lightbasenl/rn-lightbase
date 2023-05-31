// This file is codegenerated as part of the link-assets expo config plugin
type FontWeightsArray = {
  Lato: [900, 700, 200, 800, 400, 300, 500, 600];
  Exo: [900, 700, 800, 200, 400, 300, 500, 600, 100];
  Inter: [700, 500, 400];
  Kenteken: [400];
  Montserrat: [900, 700];
  "Neutra Text": [700, 500];
  "Open Sans": [700, 400, 600];
};
export type FontWeights = {
  [K in keyof FontWeightsArray]: `${FontWeightsArray[K][number]}`;
};
export const fontConfig = {
  Lato: {
    descent: -426,
    ascent: 1974,
    lineGap: 0,
    capHeight: 1457,
    unitsPerEm: 2000,
  },
  Exo: {
    descent: -327,
    ascent: 1002,
    lineGap: 0,
    capHeight: 732,
    unitsPerEm: 1000,
  },
  Inter: {
    descent: -680,
    ascent: 2728,
    lineGap: 0,
    capHeight: 2048,
    unitsPerEm: 2816,
  },
  Kenteken: null,
  Montserrat: {
    descent: -251,
    ascent: 968,
    lineGap: 0,
    capHeight: 700,
    unitsPerEm: 1000,
  },
  "Neutra Text": {
    descent: -200,
    ascent: 700,
    lineGap: 68,
    capHeight: 700,
    unitsPerEm: 1000,
  },
  "Open Sans": {
    descent: -600,
    ascent: 2189,
    lineGap: 0,
    capHeight: 1462,
    unitsPerEm: 2048,
  },
};
