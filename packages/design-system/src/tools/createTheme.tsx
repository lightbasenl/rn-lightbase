import type {
  CreateLBConfig,
  FontMetrics,
  GenericFontSizes,
  LightColors,
  SpacingConfig,
  TextVariant,
} from "../types";

export function createtheme<
  T extends LightColors,
  K extends FontMetrics,
  S extends GenericFontSizes,
  Spacing extends SpacingConfig,
  Radius extends SpacingConfig,
  TTextVariant extends TextVariant<K, S, T>
>(
  config: CreateLBConfig<K, T, S, Spacing, Radius, TTextVariant>
): CreateLBConfig<K, T, S, Spacing, Radius, TTextVariant> {
  const themeColors = {
    light: config.colors.light,
    dark: { ...config.colors.light, ...config.colors.dark },
  };

  config.colors = themeColors;
  return config;
}
