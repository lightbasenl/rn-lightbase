// this is the "main" typed object, which users re-define
// (internal) keep all types directly on this object and reference them from elsewhere
//
// const theme = createTheme(...)
// type MyConfig = typeof theme
// declare module '@lightbase/rn-design-system' {
//   export interface LBCustomConfig extends MyConfig {}
// }
// now your whole app/kit should be typed correctly
//

import { ButtonProps } from "components/Button";
import { ViewStyle } from "react-native/types";

export interface LBCustomConfig {}
export interface LBConfig extends Omit<GenericLBConfig, keyof LBCustomConfig>, LBCustomConfig {}

// CONFIG
export type CreateLBConfig<
  TMetrics extends FontMetrics,
  TColors extends LightColors,
  TFontSizes extends GenericFontSizes,
  TSpacing extends SpacingConfig,
  TRadius extends SpacingConfig,
  TTextVariant extends TextVariant<TMetrics, TFontSizes, TColors>
> = {
  typography: Typography<TMetrics, TFontSizes>;
  variants: Variants<TMetrics, TColors, TFontSizes, TTextVariant>;
  colors: ThemeColors<TColors>;
  spacing: TSpacing;
  radius: TRadius;
  defaults: Defaults<TMetrics, TFontSizes, TColors, TSpacing, TTextVariant>;
};

export type GenericLBConfig = CreateLBConfig<
  FontMetrics,
  LightColors,
  GenericFontSizes,
  SpacingConfig,
  SpacingConfig,
  TextVariant<FontMetrics, GenericFontSizes, LightColors>
>;

export type FontVariant = keyof LBConfig["variants"]["Text"];
export type FontFamily = keyof LBConfig["typography"]["fonts"];
export type FontSizes = keyof LBConfig["typography"]["sizes"];
export type FontWeights =
  | "thin"
  | "extraLight"
  | "light"
  | "regular"
  | "medium"
  | "semiBold"
  | "bold"
  | "extraBold"
  | "black";

export type ColorConfig = LBConfig["colors"]["light"];
export type ColorThemeKeys = keyof ColorConfig | { custom: string };

export type SpaceKey = keyof LBConfig["spacing"];
export type Spacing = SpaceKey | { custom: ViewStyle["margin"] } | undefined;
export type NegativeSpace = `-${SpaceKey}` | { custom: ViewStyle["margin"] } | undefined;
export type Radius = keyof LBConfig["radius"] | { custom: number };

export type DefaultButton = Omit<ButtonProps, "children" | "variants" | "themecolor"> & {
  variant: "solid" | "soft" | "outline" | "link" | "icon" | "unstyled";
  themeColor: ColorThemeKeys;
  textVariant: FontVariant;
};

export type FontMetric = {
  capHeight: number;
  unitsPerEm: number;
  descent: number;
  ascent: number;
  lineGap: number;
};

export type MarginValues = {
  margin?: NegativeSpace;
  marginBottom?: NegativeSpace;
  marginHorizontal?: NegativeSpace;
  marginLeft?: NegativeSpace;
  marginRight?: NegativeSpace;
  marginTop?: NegativeSpace;
  marginVertical?: NegativeSpace;
};
export type ColorValues = {
  backgroundColor?: ColorThemeKeys;
  borderBottomColor?: ColorThemeKeys;
  borderColor?: ColorThemeKeys;
  borderLeftColor?: ColorThemeKeys;
  borderRightColor?: ColorThemeKeys;
  borderTopColor?: ColorThemeKeys;
};
export type BorderRadiusValues = {
  borderBottomLeftRadius?: Radius;
  borderBottomRadius?: Radius;
  borderBottomRightRadius?: Radius;
  borderLeftRadius?: Radius;
  borderRadius?: Radius;
  borderRightRadius?: Radius;
  borderTopLeftRadius?: Radius;
  borderTopRadius?: Radius;
  borderTopRightRadius?: Radius;
};
export type PaddingValues = {
  padding?: Spacing;
  paddingBottom?: Spacing;
  paddingHorizontal?: Spacing;
  paddingLeft?: Spacing;
  paddingRight?: Spacing;
  paddingTop?: Spacing;
  paddingVertical?: Spacing;
};
export type BorderValues = {
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderTopWidth?: number;
  borderWidth?: number;
};

export type AlignmentValues = {
  flex?: number;
  alignItems?: ViewStyle["alignItems"];
  alignSelf?: ViewStyle["alignSelf"];
  flexDirection?: ViewStyle["flexDirection"];
  flexWrap?: ViewStyle["flexWrap"];
  justifyContent?: ViewStyle["justifyContent"];
};

export type SpacingStyles = PaddingStyles | MarginStyles;

export type ColorStyles =
  | "backgroundColor"
  | "borderBottomColor"
  | "borderColor"
  | "borderLeftColor"
  | "borderRightColor"
  | "borderTopColor";

export type RadiusStyles =
  | "borderBottomLeftRadius"
  | "borderBottomRadius"
  | "borderBottomRightRadius"
  | "borderLeftRadius"
  | "borderRadius"
  | "borderRightRadius"
  | "borderTopLeftRadius"
  | "borderTopRadius"
  | "borderTopRightRadius";

export type PaddingStyles =
  | "padding"
  | "paddingBottom"
  | "paddingHorizontal"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop"
  | "paddingVertical";

export type MarginStyles =
  | "margin"
  | "marginBottom"
  | "marginHorizontal"
  | "marginLeft"
  | "marginRight"
  | "marginTop"
  | "marginVertical";

export type BorderStyles =
  | "borderBottomColor"
  | "borderBottomWidth"
  | "borderColor"
  | "borderLeftColor"
  | "borderLeftWidth"
  | "borderRightColor"
  | "borderRightWidth"
  | "borderTopColor"
  | "borderTopWidth";

// Private types

export type LightColors = { [colorToken: string]: string };
export type ThemeColors<T extends LightColors> = { light: T; dark: Partial<T> };
export type CustomColor<T extends LightColors> = keyof T | { custom: string };
export type GenericFontSizes = { [sizeToken: string]: { fontSize: number; lineHeight: number } };
export type FontMetrics = { [family: string]: FontMetric | null };

export type SpacingConfig = { [sizeToken: string]: number };

export type Typography<TMetrics extends FontMetrics, TFontSizes extends GenericFontSizes> = {
  fonts: TMetrics;
  sizes: TFontSizes;
};

export type Variants<
  TMetrics extends FontMetrics,
  TColors extends LightColors,
  TFontSizes extends GenericFontSizes,
  TTextVariant extends TextVariant<TMetrics, TFontSizes, TColors>
> = {
  Text: TTextVariant;
  Button: any;
};

export type Defaults<
  TMetrics extends FontMetrics,
  TFontSizes extends GenericFontSizes,
  TColors extends LightColors,
  TSpacing extends SpacingConfig,
  TTextVariant extends TextVariant<TMetrics, TFontSizes, TColors>
> = {
  Text:
    | {
        variant: keyof TTextVariant;
        family?: never;
        weight?: never;
        size?: never;
        color?: never;
      }
    | {
        variant?: never;
        family: keyof TMetrics;
        weight?: FontWeights;
        size?: keyof TFontSizes;
        color?: CustomColor<TColors>;
      };
  Button?: any;
  Screen: {
    backgroundColor?: keyof TColors;
    paddingHorizontal?: keyof TSpacing;
    paddingLeft?: keyof TSpacing;
    paddingRight?: keyof TSpacing;
    padding?: keyof TSpacing;
    paddingVertical?: keyof TSpacing;
    paddingBottom?: keyof TSpacing;
    paddingTop?: keyof TSpacing;
  };
};

export type TextVariant<
  TMetrics extends FontMetrics,
  TFontSizes extends GenericFontSizes,
  TColors extends LightColors
> = {
  [variant: string]: {
    family: keyof TMetrics;
    weight: FontWeights;
    size: keyof TFontSizes;
    color: CustomColor<TColors>;
  };
};
