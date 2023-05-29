import type { CreateLBConfig, FontMetrics, GenericFontSizes, LightColors, SpacingConfig } from "../types";

export function createtheme<
  T extends LightColors,
  K extends FontMetrics,
  S extends GenericFontSizes,
  Spacing extends SpacingConfig,
  Radius extends SpacingConfig
>(config: CreateLBConfig<K, T, S, Spacing, Radius>): CreateLBConfig<K, T, S, Spacing, Radius> {
  const themeColors = {
    light: config.colors.light,
    dark: { ...config.colors.light, ...config.colors.dark },
  };

  config.colors = themeColors;
  return config;
}
